import { ArrowUpDown, Quote } from "lucide-react";
import { useMemo, useState } from "react";
import { channelIcon } from "@/components/dashboard/CitationDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customerById, productById, sourceById } from "@/data/feedback";
import {
  ALL_CATEGORIES,
  ALL_CHANNELS,
  ALL_CONFIDENCE,
  ALL_RISKS,
  channelLabels,
} from "@/lib/analytics";
import type { Channel, DashboardFilters, FeedbackItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const riskStyles: Record<string, string> = {
  High: "border-critical/50 bg-critical/10 text-critical",
  Medium: "border-warning/60 bg-warning/15 text-warning-foreground",
  Low: "border-positive/50 bg-positive/10 text-positive",
  "N/A": "border-border bg-muted text-muted-foreground",
};

type SortKey = "date" | "customer" | "risk" | "category";
const riskOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2, "N/A": 3 };

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}

interface Props {
  items: FeedbackItem[];
  filters: DashboardFilters;
  toggleIn: <K extends keyof DashboardFilters>(key: K, value: string) => void;
  onSelect: (item: FeedbackItem) => void;
}

export function EvidenceTable({ items, filters, toggleIn, onSelect }: Props) {
  const [sort, setSort] = useState<SortKey>("date");

  const visible = useMemo(() => {
    const channelFiltered = filters.channels.length
      ? items.filter((i) =>
          i.sourceIds.some((id) =>
            filters.channels.includes(sourceById.get(id)?.channel as Channel),
          ),
        )
      : items;

    const sorted = [...channelFiltered];
    sorted.sort((a, b) => {
      if (sort === "customer")
        return (customerById.get(a.customerId)?.name ?? "").localeCompare(
          customerById.get(b.customerId)?.name ?? "",
        );
      if (sort === "category") return a.category.localeCompare(b.category);
      if (sort === "risk") return riskOrder[a.churnRisk] - riskOrder[b.churnRisk];
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    return sorted;
  }, [items, filters.channels, sort]);

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-4 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">
            Categorized feedback
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {visible.length} item{visible.length === 1 ? "" : "s"} with citations
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() =>
              setSort((s) =>
                s === "date" ? "risk" : s === "risk" ? "customer" : s === "customer" ? "category" : "date",
              )
            }
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort: {sort}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {ALL_CATEGORIES.map((c) => (
              <Chip
                key={c}
                active={filters.categories.includes(c)}
                onClick={() => toggleIn("categories", c)}
              >
                {c}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_RISKS.map((r) => (
              <Chip key={r} active={filters.risks.includes(r)} onClick={() => toggleIn("risks", r)}>
                Risk: {r}
              </Chip>
            ))}
            {ALL_CONFIDENCE.map((c) => (
              <Chip
                key={c}
                active={filters.confidences.includes(c)}
                onClick={() => toggleIn("confidences", c)}
              >
                Confidence: {c}
              </Chip>
            ))}
            {ALL_CHANNELS.map((ch) => (
              <Chip
                key={ch}
                active={filters.channels.includes(ch)}
                onClick={() => toggleIn("channels", ch)}
              >
                {channelLabels[ch]}
              </Chip>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface/60">
                <TableHead className="min-w-[150px]">Customer</TableHead>
                <TableHead className="min-w-[120px]">Product</TableHead>
                <TableHead className="min-w-[140px]">Category</TableHead>
                <TableHead className="min-w-[320px]">Description</TableHead>
                <TableHead>Churn risk</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead className="text-right">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((item) => {
                const customer = customerById.get(item.customerId);
                const product = productById.get(item.productId);
                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer align-top"
                    onClick={() => onSelect(item)}
                  >
                    <TableCell>
                      <p className="font-medium">{customer?.name}</p>
                      <p className="text-xs text-muted-foreground">{customer?.segment}</p>
                    </TableCell>
                    <TableCell className="text-sm">{product?.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{item.theme}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="mt-1.5 flex items-start gap-1 text-xs text-foreground/70 italic">
                        <Quote className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        <span className="line-clamp-1">{item.excerpt}</span>
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-normal", riskStyles[item.churnRisk])}>
                        {item.churnRisk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          item.confidence === "High"
                            ? "border-info/40 text-info"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        {item.confidence}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {item.sourceIds.map((id) => {
                          const src = sourceById.get(id);
                          if (!src) return null;
                          const Icon = channelIcon[src.channel];
                          return (
                            <span
                              key={id}
                              title={`${channelLabels[src.channel]} · ${src.location}`}
                              className="rounded-md border bg-surface p-1"
                            >
                              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            </span>
                          );
                        })}
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    No feedback matches the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
