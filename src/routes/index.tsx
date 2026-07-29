import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Sparkles } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { CitationDrawer } from "@/components/dashboard/CitationDrawer";
import { EvidenceTable } from "@/components/dashboard/EvidenceTable";
import { FilterSidebar } from "@/components/dashboard/FilterSidebar";
import { LongFormView, SummaryView } from "@/components/dashboard/SummaryPanel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customerById, productById, sourceById } from "@/data/feedback";
import { useDashboardFilters, useSchedules } from "@/hooks/useDashboard";
import { buildRollup, describeScope, filterFeedback } from "@/lib/analytics";
import type { FeedbackItem } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feedback Synthesis — PM Analytics Dashboard" },
      {
        name: "description",
        content:
          "Synthesize customer feedback from support tickets, email, and Slack into categorized product insights with churn risk, confidence scores, and citations.",
      },
      { property: "og:title", content: "Feedback Synthesis — PM Analytics Dashboard" },
      {
        property: "og:description",
        content:
          "Product feedback synthesis across tickets, email, and Slack with churn risk, confidence scoring, and source citations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { filters, update, toggleIn, reset } = useDashboardFilters();
  const { schedules, add, remove, toggle } = useSchedules();
  const [view, setView] = useState<"summary" | "long">("summary");
  const [report, setReport] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [selected, setSelected] = useState<FeedbackItem | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const items = useMemo(() => filterFeedback(filters), [filters]);
  const rollup = useMemo(() => buildRollup(items), [items]);
  const scope = useMemo(() => describeScope(filters), [filters]);

  const runSynthesis = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setRunning(true);
    setError(null);
    setReport("");
    setView("long");

    const payload = {
      scope: {
        products: scope.productNames,
        customers: scope.customerNames,
        from: filters.range.from,
        to: filters.range.to,
      },
      totals: {
        items: rollup.totalItems,
        customers: rollup.uniqueCustomers,
        atRisk: rollup.atRiskCustomers,
        highConfidenceShare: rollup.highConfidenceShare,
      },
      categories: rollup.categories.map((c) => ({
        category: c.category,
        count: c.count,
        customers: c.customers,
      })),
      themes: rollup.themes.slice(0, 10).map((t) => ({
        theme: t.theme,
        category: t.category,
        requests: t.requests,
        customers: t.customers,
      })),
      evidence: items.slice(0, 60).map((i) => ({
        customer: customerById.get(i.customerId)?.name ?? "",
        product: productById.get(i.productId)?.name ?? "",
        category: i.category,
        theme: i.theme,
        churnRisk: i.churnRisk,
        confidence: i.confidence,
        excerpt: i.excerpt,
        channel: sourceById.get(i.sourceIds[0])?.channel ?? "ticket",
        date: i.createdAt.slice(0, 10),
      })),
    };

    try {
      const res = await fetch("/api/synthesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
        if (res.status === 402)
          throw new Error("AI credits are exhausted. Add credits in workspace settings.");
        throw new Error(text || "The synthesis service returned an error.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setReport(acc);
      }
      setLastRun(new Date().toISOString());
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setRunning(false);
    }
  }, [filters.range.from, filters.range.to, items, rollup, scope]);

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <FilterSidebar
        filters={filters}
        update={update}
        toggleIn={toggleIn}
        reset={reset}
        schedules={schedules}
        addSchedule={add}
        removeSchedule={remove}
        toggleSchedule={toggle}
        onRun={runSynthesis}
        running={running}
        lastRun={lastRun}
      />

      <main className="min-w-0 flex-1 space-y-6 p-5 lg:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
              <LineChart className="h-4 w-4" />
              Product feedback intelligence
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
              Feedback Synthesis Dashboard
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Synthesized from support tickets, email threads, and customer Slack channels for{" "}
              {scope.productNames.length > 2
                ? `${scope.productNames.length} products`
                : scope.productNames.join(", ")}{" "}
              · {filters.range.from} → {filters.range.to}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Tabs value={view} onValueChange={(v) => setView(v as "summary" | "long")}>
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="long" className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Long form
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Badge variant="outline" className="font-normal">
              {scope.customerNames.length > 2
                ? `${scope.customerNames.length} customers`
                : scope.customerNames.join(", ")}
            </Badge>
          </div>
        </header>

        <section aria-label="Synthesis insights">
          {view === "summary" ? (
            <SummaryView rollup={rollup} />
          ) : (
            <LongFormView report={report} loading={running} error={error} />
          )}
        </section>

        <section aria-label="Categorized feedback">
          <EvidenceTable
            items={items}
            filters={filters}
            toggleIn={toggleIn}
            onSelect={setSelected}
          />
        </section>
      </main>

      <CitationDrawer item={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
