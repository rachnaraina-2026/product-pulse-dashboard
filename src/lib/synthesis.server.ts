export interface SynthesisPayload {
  scope: {
    products: string[];
    customers: string[];
    from: string;
    to: string;
  };
  totals: {
    items: number;
    customers: number;
    atRisk: number;
    highConfidenceShare: number;
  };
  categories: { category: string; count: number; customers: number }[];
  themes: { theme: string; category: string; requests: number; customers: number }[];
  evidence: {
    customer: string;
    product: string;
    category: string;
    theme: string;
    churnRisk: string;
    confidence: string;
    excerpt: string;
    channel: string;
    date: string;
  }[];
}

export function buildSynthesisPrompt(payload: SynthesisPayload) {
  const { scope, totals, categories, themes, evidence } = payload;

  const categoryLines = categories
    .map((c) => `- ${c.category}: ${c.count} items from ${c.customers} customers`)
    .join("\n");
  const themeLines = themes
    .map((t) => `- "${t.theme}" (${t.category}) — ${t.requests} mentions / ${t.customers} customers`)
    .join("\n");
  const evidenceLines = evidence
    .map(
      (e) =>
        `- [${e.date}] ${e.customer} · ${e.product} · ${e.category} · churn ${e.churnRisk} · confidence ${e.confidence} · via ${e.channel}: "${e.excerpt}"`,
    )
    .join("\n");

  return `You are a senior product analyst writing a feedback synthesis report for a product manager.

SCOPE
Products: ${scope.products.join(", ")}
Customers: ${scope.customers.join(", ")}
Window: ${scope.from} to ${scope.to}

TOTALS
${totals.items} feedback items from ${totals.customers} customers. ${totals.atRisk} customers show elevated churn risk. ${Math.round(totals.highConfidenceShare * 100)}% of items were captured with high confidence.

CATEGORY BREAKDOWN
${categoryLines || "- none"}

TOP THEMES
${themeLines || "- none"}

EVIDENCE SAMPLE
${evidenceLines || "- none"}

Write the long-form report in markdown with these sections, in this order:
## Executive summary
## What customers are asking for
## Reliability and security signals
## Churn risk analysis
## Recommended actions

Rules: ground every claim in the evidence above and name specific customers and counts. Do not invent customers, products, or numbers. Keep the whole report under 700 words. Use short paragraphs and bullet lists. No preamble, start with the first heading.`;
}
