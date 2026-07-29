import { customerById, feedbackItems, productById } from "@/data/feedback";
import type {
  Callout,
  CategoryRollup,
  DashboardFilters,
  FeedbackItem,
  SummaryRollup,
  ThemeRollup,
} from "@/lib/types";

export const ALL_CATEGORIES: FeedbackItem["category"][] = [
  "Customer Satisfaction",
  "Bug",
  "New Feature Request",
  "Security Issue",
  "Performance",
  "Documentation",
];

export const ALL_RISKS: FeedbackItem["churnRisk"][] = ["High", "Medium", "Low", "N/A"];
export const ALL_CONFIDENCE: FeedbackItem["confidence"][] = ["High", "Low"];
export const ALL_CHANNELS = ["ticket", "email", "slack"] as const;

export const channelLabels: Record<string, string> = {
  ticket: "Support ticket",
  email: "Email",
  slack: "Slack",
};

export function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoDay(d);
}

export function filterFeedback(filters: DashboardFilters): FeedbackItem[] {
  const from = new Date(`${filters.range.from}T00:00:00Z`).getTime();
  const to = new Date(`${filters.range.to}T23:59:59Z`).getTime();

  return feedbackItems
    .filter((item) => {
      const t = new Date(item.createdAt).getTime();
      if (t < from || t > to) return false;
      if (filters.productIds.length && !filters.productIds.includes(item.productId)) return false;
      if (filters.customerIds.length && !filters.customerIds.includes(item.customerId))
        return false;
      if (filters.categories.length && !filters.categories.includes(item.category)) return false;
      if (filters.risks.length && !filters.risks.includes(item.churnRisk)) return false;
      if (filters.confidences.length && !filters.confidences.includes(item.confidence))
        return false;
      return true;
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function buildRollup(items: FeedbackItem[]): SummaryRollup {
  const total = items.length;
  const customers = new Set(items.map((i) => i.customerId));

  const categories: CategoryRollup[] = ALL_CATEGORIES.map((category) => {
    const subset = items.filter((i) => i.category === category);
    return {
      category,
      count: subset.length,
      customers: new Set(subset.map((i) => i.customerId)).size,
      share: total ? subset.length / total : 0,
    };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const themeMap = new Map<string, FeedbackItem[]>();
  for (const item of items) {
    const list = themeMap.get(item.theme) ?? [];
    list.push(item);
    themeMap.set(item.theme, list);
  }

  const themes: ThemeRollup[] = [...themeMap.entries()]
    .map(([theme, list]) => {
      const names = [...new Set(list.map((i) => customerById.get(i.customerId)?.name ?? ""))];
      return {
        theme,
        category: list[0].category,
        requests: list.length,
        customers: names.length,
        topCustomers: names.slice(0, 4),
      };
    })
    .sort((a, b) => b.customers - a.customers || b.requests - a.requests);

  const atRisk = new Set(
    items.filter((i) => i.churnRisk === "High" || i.churnRisk === "Medium").map((i) => i.customerId),
  );

  const calloutMap = new Map<string, Callout>();
  for (const item of items) {
    const customer = customerById.get(item.customerId)?.name ?? "Unknown";
    if (item.churnRisk === "High") {
      const key = `high-${item.customerId}-${item.theme}`;
      calloutMap.set(key, {
        severity: "critical",
        title: item.theme,
        detail: item.description,
        customer,
      });
    } else if (item.category === "Security Issue") {
      calloutMap.set(`sec-${item.customerId}-${item.theme}`, {
        severity: "warning",
        title: item.theme,
        detail: item.description,
        customer,
      });
    }
  }

  return {
    totalItems: total,
    uniqueCustomers: customers.size,
    atRiskCustomers: atRisk.size,
    highConfidenceShare: total
      ? items.filter((i) => i.confidence === "High").length / total
      : 0,
    categories,
    themes,
    callouts: [...calloutMap.values()]
      .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "critical" ? -1 : 1))
      .slice(0, 6),
  };
}

export function describeScope(filters: DashboardFilters) {
  const productNames = filters.productIds.length
    ? filters.productIds.map((id) => productById.get(id)?.name ?? id)
    : ["All products"];
  const customerNames = filters.customerIds.length
    ? filters.customerIds.map((id) => customerById.get(id)?.name ?? id)
    : ["All customers"];
  return { productNames, customerNames };
}
