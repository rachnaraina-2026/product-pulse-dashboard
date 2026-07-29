export type Channel = "ticket" | "email" | "slack";

export type FeedbackCategory =
  | "Customer Satisfaction"
  | "Bug"
  | "New Feature Request"
  | "Security Issue"
  | "Performance"
  | "Documentation";

export type ChurnRisk = "N/A" | "Low" | "Medium" | "High";
export type Confidence = "High" | "Low";

export interface ProductLine {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  lineId: string;
}

export interface Customer {
  id: string;
  name: string;
  segment: "Enterprise" | "Mid-Market" | "SMB";
  arr: number;
}

export interface SourceItem {
  id: string;
  channel: Channel;
  author: string;
  authorRole: string;
  timestamp: string; // ISO
  title: string;
  body: string;
  permalink: string;
  location: string; // channel name, inbox, or ticket queue
}

export interface FeedbackItem {
  id: string;
  customerId: string;
  productId: string;
  category: FeedbackCategory;
  theme: string;
  description: string;
  churnRisk: ChurnRisk;
  confidence: Confidence;
  createdAt: string; // ISO
  sourceIds: string[];
  excerpt: string;
}

export interface DateRange {
  from: string; // ISO date (yyyy-mm-dd)
  to: string;
}

export interface DashboardFilters {
  productIds: string[]; // empty = all
  customerIds: string[]; // empty = all
  range: DateRange;
  categories: FeedbackCategory[];
  risks: ChurnRisk[];
  confidences: Confidence[];
  channels: Channel[];
}

export type Cadence = "off" | "weekly" | "monthly" | "custom";

export interface Schedule {
  id: string;
  cadence: Cadence;
  weekday: number; // 0-6
  dayOfMonth: number;
  everyNDays: number;
  time: string; // HH:mm
  enabled: boolean;
  createdAt: string;
}

export interface CategoryRollup {
  category: FeedbackCategory;
  count: number;
  customers: number;
  share: number;
}

export interface ThemeRollup {
  theme: string;
  category: FeedbackCategory;
  requests: number;
  customers: number;
  topCustomers: string[];
}

export interface Callout {
  severity: "critical" | "warning";
  title: string;
  detail: string;
  customer: string;
}

export interface SummaryRollup {
  totalItems: number;
  uniqueCustomers: number;
  atRiskCustomers: number;
  highConfidenceShare: number;
  categories: CategoryRollup[];
  themes: ThemeRollup[];
  callouts: Callout[];
}
