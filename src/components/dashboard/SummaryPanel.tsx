import { AlertTriangle, ChevronRight, ShieldAlert, Sparkles, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import type { SummaryRollup } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryColor: Record<string, string> = {
  "Customer Satisfaction": "bg-chart-6",
  Bug: "bg-chart-4",
  "New Feature Request": "bg-chart-1",
  "Security Issue": "bg-critical",
  Performance: "bg-chart-3",
  Documentation: "bg-chart-2",
};

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Users;
  tone?: "critical" | "default";
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </span>
          <Icon
            className={cn("h-4 w-4", tone === "critical" ? "text-critical" : "text-primary")}
          />
        </div>
        <p
          className={cn(
            "mt-2 font-display text-3xl font-semibold",
            tone === "critical" && "text-critical",
          )}
        >
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export function SummaryView({ rollup }: { rollup: SummaryRollup }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Feedback items"
          value={String(rollup.totalItems)}
          hint="Synthesized in the selected window"
          icon={Sparkles}
        />
        <Kpi
          label="Customers heard"
          value={String(rollup.uniqueCustomers)}
          hint="Distinct accounts contributing feedback"
          icon={Users}
        />
        <Kpi
          label="Accounts at risk"
          value={String(rollup.atRiskCustomers)}
          hint="Showing high or medium churn signal"
          icon={AlertTriangle}
          tone="critical"
        />
        <Kpi
          label="High confidence"
          value={`${Math.round(rollup.highConfidenceShare * 100)}%`}
          hint="Share of items captured with high confidence"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Feedback by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rollup.categories.map((c) => (
              <div key={c.category} className="space-y-1.5">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">{c.category}</span>
                  <span className="text-muted-foreground">
                    {c.count} · {c.customers} customers
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", categoryColor[c.category] ?? "bg-primary")}
                    style={{ width: `${Math.max(3, c.share * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {rollup.categories.length === 0 && (
              <p className="text-sm text-muted-foreground">No feedback in this scope.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Most requested themes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rollup.themes.slice(0, 6).map((t) => (
              <div
                key={t.theme}
                className="flex items-start justify-between gap-4 rounded-lg border bg-surface/60 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.theme}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {t.topCustomers.join(", ")}
                    {t.customers > t.topCustomers.length &&
                      ` +${t.customers - t.topCustomers.length} more`}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-lg font-semibold">{t.requests}×</p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.customers} customer{t.customers === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            ))}
            {rollup.themes.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing to rank yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-critical/30 bg-critical/5 p-4 text-left transition-colors hover:bg-critical/10"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <ShieldAlert className="h-4 w-4 text-critical" />
              Needs immediate attention
              <Badge variant="outline" className="border-critical/50 font-normal text-critical">
                {rollup.callouts.length}
              </Badge>
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              View details
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-critical" />
              Needs immediate attention
            </SheetTitle>
          </SheetHeader>
          <div className="grid gap-3 p-4 pt-0">
            {rollup.callouts.map((c, i) => (
              <div
                key={`${c.title}-${i}`}
                className={cn(
                  "rounded-lg border p-3",
                  c.severity === "critical"
                    ? "border-critical/40 bg-critical/5"
                    : "border-warning/40 bg-warning/10",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{c.customer}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal",
                      c.severity === "critical"
                        ? "border-critical/50 text-critical"
                        : "border-warning/60 text-warning-foreground",
                    )}
                  >
                    {c.severity === "critical" ? "High churn risk" : "Security"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-medium">{c.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
              </div>
            ))}
            {rollup.callouts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No urgent churn or security signals in this scope.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}

export function LongFormView({
  report,
  loading,
  error,
}: {
  report: string;
  loading: boolean;
  error: string | null;
}) {
  if (error) {
    return (
      <Card className="border-critical/40 shadow-card">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-critical">Synthesis unavailable</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            The summary view above still reflects the full filtered dataset.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!report && loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="space-y-3 p-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className={cn("h-4", i % 3 === 0 ? "w-1/3" : "w-full")} />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-8 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-primary" />
          <p className="mt-3 text-sm font-medium">No long-form report yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run the synthesis to generate the narrative report for this scope.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <Markdown text={report} />
        {loading && <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-primary" />}
      </CardContent>
    </Card>
  );
}

function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;
        if (trimmed.startsWith("### "))
          return (
            <h4 key={i} className="pt-3 font-display text-sm font-semibold text-primary">
              {trimmed.slice(4)}
            </h4>
          );
        if (trimmed.startsWith("## "))
          return (
            <h3 key={i} className="pt-4 font-display text-lg font-semibold">
              {trimmed.slice(3)}
            </h3>
          );

        if (trimmed.startsWith("# "))
          return (
            <h2 key={i} className="pt-3 font-display text-xl font-semibold">
              {trimmed.slice(2)}
            </h2>
          );
        if (/^[-*]\s/.test(trimmed))
          return (
            <p key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/90">
              <span className="text-primary">•</span>
              <span>{inline(trimmed.slice(2))}</span>
            </p>
          );
        return (
          <p key={i} className="text-sm leading-relaxed text-foreground/90">
            {inline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
