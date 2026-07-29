import { useCallback, useEffect, useMemo, useState } from "react";
import { daysAgo, isoDay } from "@/lib/analytics";
import type { DashboardFilters, Schedule } from "@/lib/types";

const SCHEDULE_KEY = "pm-synthesis-schedules";

export function defaultFilters(): DashboardFilters {
  return {
    productIds: [],
    customerIds: [],
    range: { from: daysAgo(30), to: isoDay(new Date()) },
    categories: [],
    risks: [],
    confidences: [],
    channels: [],
  };
}

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  const update = useCallback(<K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleIn = useCallback(
    <K extends keyof DashboardFilters>(key: K, value: string) => {
      setFilters((prev) => {
        const list = prev[key] as unknown as string[];
        const next = list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value];
        return { ...prev, [key]: next } as DashboardFilters;
      });
    },
    [],
  );

  const reset = useCallback(() => setFilters(defaultFilters()), []);

  return { filters, setFilters, update, toggleIn, reset };
}

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SCHEDULE_KEY);
      if (raw) setSchedules(JSON.parse(raw) as Schedule[]);
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedules));
  }, [schedules, hydrated]);

  const add = useCallback((schedule: Omit<Schedule, "id" | "createdAt">) => {
    setSchedules((prev) => [
      ...prev,
      { ...schedule, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggle = useCallback((id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  }, []);

  return useMemo(
    () => ({ schedules, add, remove, toggle, hydrated }),
    [schedules, add, remove, toggle, hydrated],
  );
}

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function describeSchedule(schedule: Schedule) {
  if (schedule.cadence === "weekly") return `Every ${weekdayNames[schedule.weekday]} at ${schedule.time}`;
  if (schedule.cadence === "monthly")
    return `Day ${schedule.dayOfMonth} of every month at ${schedule.time}`;
  if (schedule.cadence === "custom") return `Every ${schedule.everyNDays} days at ${schedule.time}`;
  return "Paused";
}

export function nextRunLabel(schedule: Schedule) {
  const now = new Date();
  const [hh, mm] = schedule.time.split(":").map(Number);
  const next = new Date(now);
  next.setHours(hh || 9, mm || 0, 0, 0);

  if (schedule.cadence === "weekly") {
    const delta = (schedule.weekday - next.getDay() + 7) % 7;
    next.setDate(next.getDate() + (delta === 0 && next <= now ? 7 : delta));
  } else if (schedule.cadence === "monthly") {
    next.setDate(schedule.dayOfMonth);
    if (next <= now) next.setMonth(next.getMonth() + 1);
  } else if (schedule.cadence === "custom") {
    if (next <= now) next.setDate(next.getDate() + Math.max(1, schedule.everyNDays));
  } else {
    return "—";
  }

  return next.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export { weekdayNames };
