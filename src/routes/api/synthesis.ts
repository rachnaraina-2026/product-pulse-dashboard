import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildSynthesisPrompt, type SynthesisPayload } from "@/lib/synthesis.server";

export const Route = createFileRoute("/api/synthesis")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = (await request.json()) as SynthesisPayload;
        if (!payload || typeof payload !== "object" || !payload.scope) {
          return new Response("Invalid payload", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("AI is not configured for this project.", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);

        try {
          const result = streamText({
            model: gateway("openai/gpt-5.6-sol"),
            prompt: buildSynthesisPrompt({
              ...payload,
              evidence: (payload.evidence ?? []).slice(0, 60),
            }),
            providerOptions: { lovable: { reasoningEffort: "none" } },
          });

          return result.toTextStreamResponse({
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          const status = /429|rate limit/i.test(message)
            ? 429
            : /402|credit/i.test(message)
              ? 402
              : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
