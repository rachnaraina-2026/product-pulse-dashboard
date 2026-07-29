import { CalendarClock, Filter, Play, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { MultiSelect, type MultiOption } from "@/components/dashboard/MultiSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { customers, productLineById, products } from "@/data/feedback";
import { describeSchedule, nextRunLabel, weekdayNames } from "@/hooks/useDashboard";
import { daysAgo, isoDay } from "@/lib/analytics";
import type { Cadence, DashboardFilters, Schedule } from "@/lib/types";

const productOptions: MultiOption[] = products.map((p) => ({
  value: p.id,
  label: p.name,
  group: productLineById.get(p.lineId)?.name,
}));

const customerOptions: MultiOption[] = customers.map((c) => ({
  value: c.id,
  label: c.name,
  group: c.segment,
}));

const presets = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "QTD", days: -1 },
];

interface Props {
  filters: DashboardFilters;
  update: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  toggleIn: <K extends keyof DashboardFilters>(key: K, value: string) => void;
  reset: () => void;
  schedules: Schedule[];
  addSchedule: (s: Omit<Schedule, "id" | "createdAt">) => void;
  removeSchedule: (id: string) => void;
  toggleSchedule: (id: string) => void;
  onRun: () => void;
  running: boolean;
  lastRun: string | null;
}

export function FilterSidebar({
  filters,
  update,
  toggleIn,
  reset,
  schedules,
  addSchedule,
  removeSchedule,
  toggleSchedule,
  onRun,
  running,
  lastRun,
}: Props) {
  const [cadence, setCadence] = useState<Cadence>("weekly");
  const [weekday, setWeekday] = useState(1);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [everyNDays, setEveryNDays] = useState(14);
  const [time, setTime] = useState("09:00");

  const applyPreset = (days: number) => {
    if (days === -1) {
      const now = new Date();
      const q = Math.floor(now.getMonth() / 3) * 3;
      const from = new Date(now.getFullYear(), q, 1);
      update("range", { from: isoDay(from), to: isoDay(now) });
      return;
    }
    update("range", { from: daysAgo(days), to: isoDay(new Date()) });
  };

  return (
    <aside className="flex h-full w-full flex-col gap-6 overflow-y-auto border-r bg-sidebar p-5 lg:w-[340px] lg:shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Filter className="h-4 w-4 text-primary" />
          Report scope
        </div>
        <Button variant="ghost" size="sm" onClick={reset} className="h-8 gap-1.5 text-xs">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <section className="space-y-2">
        <Label className="text-xs tracking-wide text-muted-foreground uppercase">Products</Label>
        <MultiSelect
          options={productOptions}
          selected={filters.productIds}
          onToggle={(v) => toggleIn("productIds", v)}
          onClear={() => update("productIds", [])}
          allLabel="All products"
          searchable
        />
      </section>

      <section className="space-y-2">
        <Label className="text-xs tracking-wide text-muted-foreground uppercase">Customers</Label>
        <MultiSelect
          options={customerOptions}
          selected={filters.customerIds}
          onToggle={(v) => toggleIn("customerIds", v)}
          onClear={() => update("customerIds", [])}
          allLabel="All customers"
          searchable
        />
      </section>

      <section className="space-y-2">
        <Label className="text-xs tracking-wide text-muted-foreground uppercase">Date range</Label>
        <div className="flex gap-1.5">
          {presets.map((p) => (
            <Button
              key={p.label}
              variant="outline"
              size="sm"
              className="h-8 flex-1 bg-card px-0 text-xs"
              onClick={() => applyPreset(p.days)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">From</span>
            <Input
              type="date"
              value={filters.range.from}
              max={filters.range.to}
              onChange={(e) => update("range", { ...filters.range, from: e.target.value })}
              className="h-9 bg-card"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">To</span>
            <Input
              type="date"
              value={filters.range.to}
              min={filters.range.from}
              onChange={(e) => update("range", { ...filters.range, to: e.target.value })}
              className="h-9 bg-card"
            />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Feedback outside this window is excluded from the synthesis.
        </p>
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CalendarClock className="h-4 w-4 text-primary" />
          Report cadence
        </div>

        <Select value={cadence} onValueChange={(v) => setCadence(v as Cadence)}>
          <SelectTrigger className="bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="off">Off — on demand only</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Every N days</SelectItem>
          </SelectContent>
        </Select>

        {cadence === "weekly" && (
          <Select value={String(weekday)} onValueChange={(v) => setWeekday(Number(v))}>
            <SelectTrigger className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {weekdayNames.map((d, i) => (
                <SelectItem key={d} value={String(i)}>
                  Every {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {cadence === "monthly" && (
          <Select value={String(dayOfMonth)} onValueChange={(v) => setDayOfMonth(Number(v))}>
            <SelectTrigger className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <SelectItem key={d} value={String(d)}>
                  Day {d} of the month
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {cadence === "custom" && (
          <Input
            type="number"
            min={1}
            max={90}
            value={everyNDays}
            onChange={(e) => setEveryNDays(Number(e.target.value))}
            className="bg-card"
          />
        )}

        {cadence !== "off" && (
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-9 bg-card"
            />
            <Button
              size="sm"
              variant="secondary"
              className="shrink-0"
              onClick={() =>
                addSchedule({ cadence, weekday, dayOfMonth, everyNDays, time, enabled: true })
              }
            >
              Save schedule
            </Button>
          </div>
        )}

        {schedules.length > 0 && (
          <ul className="space-y-2">
            {schedules.map((s) => (
              <li key={s.id} className="rounded-lg border bg-card p-3 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{describeSchedule(s)}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Next run {s.enabled ? nextRunLabel(s) : "— paused"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch checked={s.enabled} onCheckedChange={() => toggleSchedule(s.id)} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeSchedule(s.id)}
                      aria-label="Delete schedule"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-auto space-y-2 pt-2">
        <Button className="w-full gap-2" onClick={onRun} disabled={running}>
          <Play className="h-4 w-4" />
          {running ? "Synthesizing…" : "Run synthesis now"}
        </Button>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Last run</span>
          <Badge variant="outline" className="font-normal">
            {lastRun ? new Date(lastRun).toLocaleString() : "Not run yet"}
          </Badge>
        </div>
      </div>
    </aside>
  );
}
