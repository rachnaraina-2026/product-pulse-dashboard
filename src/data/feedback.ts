import type {
  Channel,
  Customer,
  FeedbackCategory,
  FeedbackItem,
  Product,
  ProductLine,
  SourceItem,
} from "@/lib/types";

export const productLines: ProductLine[] = [
  { id: "pl-platform", name: "Core Platform" },
  { id: "pl-data", name: "Data Cloud" },
  { id: "pl-growth", name: "Growth Suite" },
];

export const products: Product[] = [
  { id: "p-workflows", name: "Workflows", lineId: "pl-platform" },
  { id: "p-identity", name: "Identity & SSO", lineId: "pl-platform" },
  { id: "p-warehouse", name: "Warehouse Sync", lineId: "pl-data" },
  { id: "p-insights", name: "Insights Explorer", lineId: "pl-data" },
  { id: "p-campaigns", name: "Campaign Studio", lineId: "pl-growth" },
  { id: "p-portal", name: "Customer Portal", lineId: "pl-growth" },
];

export const customers: Customer[] = [
  { id: "c-northwind", name: "Northwind Logistics", segment: "Enterprise", arr: 480000 },
  { id: "c-arclight", name: "Arclight Health", segment: "Enterprise", arr: 620000 },
  { id: "c-brightpath", name: "Brightpath Financial", segment: "Enterprise", arr: 540000 },
  { id: "c-meridian", name: "Meridian Retail", segment: "Mid-Market", arr: 180000 },
  { id: "c-kestrel", name: "Kestrel Labs", segment: "Mid-Market", arr: 145000 },
  { id: "c-volta", name: "Volta Energy", segment: "Enterprise", arr: 710000 },
  { id: "c-lumen", name: "Lumen Education", segment: "Mid-Market", arr: 96000 },
  { id: "c-halcyon", name: "Halcyon Media", segment: "Mid-Market", arr: 132000 },
  { id: "c-tidal", name: "Tidal Foods", segment: "SMB", arr: 42000 },
  { id: "c-quarry", name: "Quarry Construction", segment: "SMB", arr: 38000 },
  { id: "c-orbit", name: "Orbit Travel", segment: "Mid-Market", arr: 155000 },
  { id: "c-sable", name: "Sable Insurance", segment: "Enterprise", arr: 505000 },
  { id: "c-junegrove", name: "Junegrove Retail", segment: "SMB", arr: 51000 },
  { id: "c-pinnacle", name: "Pinnacle Manufacturing", segment: "Enterprise", arr: 430000 },
  { id: "c-cobalt", name: "Cobalt Robotics", segment: "Mid-Market", arr: 121000 },
  { id: "c-verdant", name: "Verdant Agriculture", segment: "SMB", arr: 47000 },
  { id: "c-atlasbank", name: "Atlas Bank", segment: "Enterprise", arr: 890000 },
  { id: "c-mosaic", name: "Mosaic Nonprofit", segment: "SMB", arr: 29000 },
  { id: "c-riverstone", name: "Riverstone Legal", segment: "Mid-Market", arr: 168000 },
  { id: "c-nimbus", name: "Nimbus Telecom", segment: "Enterprise", arr: 660000 },
];

interface Template {
  category: FeedbackCategory;
  theme: string;
  productIds: string[];
  headline: string;
  description: string;
  quotes: string[];
  risk: "high" | "medium" | "low" | "none";
}

const templates: Template[] = [
  {
    category: "New Feature Request",
    theme: "Bulk approvals in Workflows",
    productIds: ["p-workflows"],
    headline: "Need bulk approve/reject for queued workflow steps",
    description:
      "Approvers must action queued steps one at a time. Teams with hundreds of daily approvals want multi-select with a single confirm and an audit note.",
    quotes: [
      "Our ops leads clear 300+ approvals a morning and every one takes four clicks. Bulk approve would give us hours back each week.",
      "Can we get multi-select on the approvals queue? Right now we export to a spreadsheet and re-key decisions, which defeats the purpose.",
      "Please add bulk actions. My team has started batching approvals to Fridays because the click-through cost is so high.",
    ],
    risk: "low",
  },
  {
    category: "New Feature Request",
    theme: "Scheduled report exports",
    productIds: ["p-insights", "p-warehouse"],
    headline: "Recurring scheduled exports to email and S3",
    description:
      "Customers want saved views delivered on a cadence (weekly/monthly) to email distribution lists and cloud storage instead of manual CSV pulls.",
    quotes: [
      "Every Monday someone on my team manually exports the same four views. A scheduled delivery would remove a standing calendar hold.",
      "We need exports dropped into our S3 bucket nightly so downstream jobs can pick them up without a human in the loop.",
      "Scheduled email delivery of the exec view is the single thing blocking wider rollout to our leadership team.",
    ],
    risk: "none",
  },
  {
    category: "New Feature Request",
    theme: "Granular role-based permissions",
    productIds: ["p-identity", "p-portal"],
    headline: "Custom roles with per-object permissions",
    description:
      "The three built-in roles are too coarse. Regulated customers need custom roles scoped to specific objects, environments, and fields.",
    quotes: [
      "Admin-or-viewer isn't workable for us. Our auditors expect least-privilege roles per environment.",
      "We had to create shadow accounts because there's no way to give someone edit on one workspace and read on another.",
      "Custom roles were promised as 'on the roadmap' at renewal. We need a date before our next compliance review.",
    ],
    risk: "medium",
  },
  {
    category: "Bug",
    theme: "Warehouse sync drops rows silently",
    productIds: ["p-warehouse"],
    headline: "Incremental sync silently skips rows after a schema change",
    description:
      "When a column is added upstream, the incremental sync completes as successful but omits rows written during the migration window. No error is surfaced.",
    quotes: [
      "We reconciled 18,400 missing rows this month. The sync said success every single run.",
      "A silent data loss bug is the worst possible failure mode for us. We need alerting at minimum.",
      "Our finance close was delayed two days because the numbers didn't tie. Root cause was the sync skipping the migration window.",
    ],
    risk: "high",
  },
  {
    category: "Bug",
    theme: "Campaign scheduling timezone drift",
    productIds: ["p-campaigns"],
    headline: "Scheduled campaigns fire one hour early after DST change",
    description:
      "Campaigns scheduled before a daylight-saving transition send an hour early, hitting recipients outside approved send windows.",
    quotes: [
      "Our 8am send went out at 7am to the entire APAC list. Compliance flagged it.",
      "Third DST cycle in a row with the same drift. We now manually re-save every campaign twice a year.",
      "Please fix timezone handling — we can't keep explaining early sends to our brand team.",
    ],
    risk: "medium",
  },
  {
    category: "Bug",
    theme: "Portal session expiry loop",
    productIds: ["p-portal"],
    headline: "End users caught in a redirect loop after session expiry",
    description:
      "Expired portal sessions redirect to login and back repeatedly until cookies are cleared manually. Reported most often on Safari.",
    quotes: [
      "Our customers can't get back in without clearing cookies. Support volume on our side has doubled.",
      "Safari users hit an infinite redirect. We've had to publish a workaround article.",
      "This is customer-facing for us, which makes it far more painful than an internal bug.",
    ],
    risk: "medium",
  },
  {
    category: "Security Issue",
    theme: "SCIM deprovisioning delay",
    productIds: ["p-identity"],
    headline: "Deprovisioned users retain access for up to 24 hours",
    description:
      "SCIM deletes are processed on a daily batch rather than immediately, leaving offboarded employees with valid sessions well past termination.",
    quotes: [
      "An offboarded contractor still had access the next morning. That's a reportable finding for us.",
      "Our security review flagged the deprovisioning lag as a blocker for expanding to the regulated business unit.",
      "We need near-real-time SCIM deletes and session revocation, not a nightly batch.",
    ],
    risk: "high",
  },
  {
    category: "Security Issue",
    theme: "Audit log retention and export",
    productIds: ["p-identity", "p-workflows"],
    headline: "90-day audit log retention is below policy minimums",
    description:
      "Customers in regulated industries require 12-24 months of immutable audit logs with SIEM streaming; current retention is 90 days with manual export.",
    quotes: [
      "Our policy is 18 months minimum. 90 days means we're technically out of compliance the day we go live.",
      "We need a Splunk stream, not a CSV button. Manual export won't pass audit.",
      "Retention came up in our renewal review as a must-fix.",
    ],
    risk: "high",
  },
  {
    category: "Performance",
    theme: "Insights Explorer query latency",
    productIds: ["p-insights"],
    headline: "Dashboards over 90 days of data take 40+ seconds to load",
    description:
      "Query latency scales poorly past a 90-day window. Users abandon dashboards or shorten ranges, undermining trust in the tool.",
    quotes: [
      "A quarter-over-quarter view takes 45 seconds. People stopped opening it.",
      "We tell new analysts to keep it under 30 days, which isn't how anyone actually works.",
      "If load time were under five seconds this would be our default reporting layer.",
    ],
    risk: "medium",
  },
  {
    category: "Performance",
    theme: "Workflow run queue backlog",
    productIds: ["p-workflows"],
    headline: "Run queue backs up during peak hours",
    description:
      "During 9-11am peaks, workflow runs queue for several minutes, delaying time-sensitive automations and downstream notifications.",
    quotes: [
      "Runs that should be instant sit in queue for six or seven minutes every morning.",
      "Our SLA-driven notifications go out late because of the morning backlog.",
      "We've staggered our triggers as a workaround, but that's fragile.",
    ],
    risk: "low",
  },
  {
    category: "Customer Satisfaction",
    theme: "Support response times",
    productIds: ["p-workflows", "p-warehouse", "p-portal"],
    headline: "Slow first response on production-impacting tickets",
    description:
      "Customers report multi-day first responses on P1 tickets and inconsistent handoffs between support and engineering.",
    quotes: [
      "Three days for a first response on a production issue isn't acceptable at our contract level.",
      "We get handed between three people and have to re-explain the issue each time.",
      "The product is good. The support experience is what's making us nervous about renewal.",
    ],
    risk: "high",
  },
  {
    category: "Customer Satisfaction",
    theme: "Onboarding and enablement",
    productIds: ["p-campaigns", "p-insights"],
    headline: "New admins struggle to get productive in the first month",
    description:
      "Teams want guided setup, role-based enablement paths, and sandbox environments to ramp new admins without risking production.",
    quotes: [
      "Our new admin spent two weeks guessing. A guided setup would have cut that to two days.",
      "There's no safe place to experiment. People are scared of breaking live campaigns.",
      "Enablement content assumes you already know the data model.",
    ],
    risk: "low",
  },
  {
    category: "Documentation",
    theme: "API reference gaps",
    productIds: ["p-warehouse", "p-workflows", "p-identity"],
    headline: "API docs missing error codes and pagination examples",
    description:
      "Developers report undocumented error codes, unclear pagination semantics, and stale sample payloads that no longer match responses.",
    quotes: [
      "Half the error codes we hit aren't in the docs. We reverse-engineer from responses.",
      "Pagination behaviour differs between two endpoints and neither documents it.",
      "The sample payload in the docs hasn't matched the real response since the last release.",
    ],
    risk: "none",
  },
  {
    category: "Documentation",
    theme: "Migration guides",
    productIds: ["p-portal", "p-campaigns"],
    headline: "No migration guide for the new template engine",
    description:
      "Customers migrating to the new template engine want a step-by-step guide, a compatibility matrix, and a rollback path.",
    quotes: [
      "We paused our migration because there's no rollback story documented.",
      "A compatibility matrix would answer 80% of the questions we've filed tickets about.",
      "We need a written migration path before we commit a sprint to this.",
    ],
    risk: "none",
  },
  {
    category: "New Feature Request",
    theme: "Native Slack alerting",
    productIds: ["p-workflows", "p-insights"],
    headline: "Push alerts and digests natively into Slack",
    description:
      "Customers want threshold alerts and daily digests delivered to Slack channels without building a custom webhook relay.",
    quotes: [
      "We maintain a homegrown relay just to get alerts into Slack. Please make it native.",
      "A daily digest in our #ops channel would replace three standing meetings.",
      "Native Slack alerting is table stakes for us at this point.",
    ],
    risk: "low",
  },
];

const authors = [
  ["Priya Raghavan", "Director of Operations"],
  ["Marcus Webb", "Platform Engineer"],
  ["Dana Kowalski", "VP Customer Experience"],
  ["Tomas Lindqvist", "Data Engineering Lead"],
  ["Amara Osei", "Security Architect"],
  ["Jonah Feldman", "Product Operations Manager"],
  ["Wei Chen", "Analytics Manager"],
  ["Sofia Marchetti", "IT Administrator"],
  ["Ben Okafor", "Head of Growth Marketing"],
  ["Elena Ruiz", "Compliance Officer"],
];

const slackChannels = [
  "#cs-escalations",
  "#customer-northwind",
  "#support-fire-drill",
  "#account-reviews",
  "#voice-of-customer",
];

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function buildDataset() {
  const rng = makeRng(20260729);
  const sources: SourceItem[] = [];
  const feedback: FeedbackItem[] = [];
  const now = new Date("2026-07-29T12:00:00Z").getTime();
  const dayMs = 86400000;

  let sIdx = 0;
  let fIdx = 0;

  for (let i = 0; i < 156; i++) {
    const tpl = templates[Math.floor(rng() * templates.length)];
    const productId = pick(rng, tpl.productIds);
    const customer = pick(rng, customers);
    const [author, role] = pick(rng, authors);
    const channel: Channel = (["ticket", "email", "slack"] as Channel[])[
      Math.floor(rng() * 3)
    ];
    const daysAgo = Math.floor(rng() * 120);
    const ts = new Date(now - daysAgo * dayMs - Math.floor(rng() * dayMs)).toISOString();
    const quote = pick(rng, tpl.quotes);
    const product = products.find((p) => p.id === productId)!;

    const primary: SourceItem = {
      id: `src-${++sIdx}`,
      channel,
      author,
      authorRole: role,
      timestamp: ts,
      title:
        channel === "ticket"
          ? `[${customer.name}] ${tpl.headline}`
          : channel === "email"
            ? `Re: ${product.name} — ${tpl.theme}`
            : `${tpl.theme} raised by ${customer.name}`,
      body:
        channel === "slack"
          ? `${quote}\n\nFlagged during the weekly sync with ${customer.name}. Logging here so it lands in the next synthesis.`
          : `Hi team,\n\n${quote}\n\nHappy to jump on a call with details.\n\n${author}\n${role}, ${customer.name}`,
      permalink:
        channel === "slack"
          ? `https://acme.slack.com/archives/C0${sIdx}/p17${sIdx}00000`
          : channel === "ticket"
            ? `https://support.acme.io/tickets/${4200 + sIdx}`
            : `https://mail.acme.io/thread/${8100 + sIdx}`,
      location:
        channel === "slack"
          ? pick(rng, slackChannels)
          : channel === "ticket"
            ? `Support queue · ${customer.segment}`
            : "support@acme.io",
    };
    sources.push(primary);
    const sourceIds = [primary.id];

    // ~25% of items are corroborated by a second source
    if (rng() < 0.25) {
      const [author2, role2] = pick(rng, authors);
      const channel2: Channel = channel === "slack" ? "email" : "slack";
      const secondary: SourceItem = {
        id: `src-${++sIdx}`,
        channel: channel2,
        author: author2,
        authorRole: role2,
        timestamp: new Date(new Date(ts).getTime() + dayMs).toISOString(),
        title: `${tpl.theme} — follow-up from ${customer.name}`,
        body: `${pick(rng, tpl.quotes)}\n\nSecond report of the same issue this week.`,
        permalink: `https://acme.slack.com/archives/C1${sIdx}/p17${sIdx}00000`,
        location: channel2 === "slack" ? pick(rng, slackChannels) : "support@acme.io",
      };
      sources.push(secondary);
      sourceIds.push(secondary.id);
    }

    const riskRoll = rng();
    let churnRisk: FeedbackItem["churnRisk"] = "N/A";
    if (tpl.risk === "high") churnRisk = riskRoll < 0.6 ? "High" : "Medium";
    else if (tpl.risk === "medium") churnRisk = riskRoll < 0.45 ? "Medium" : "Low";
    else if (tpl.risk === "low") churnRisk = riskRoll < 0.5 ? "Low" : "N/A";
    if (customer.segment === "Enterprise" && churnRisk === "Low" && riskRoll > 0.8) {
      churnRisk = "Medium";
    }

    feedback.push({
      id: `fb-${++fIdx}`,
      customerId: customer.id,
      productId,
      category: tpl.category,
      theme: tpl.theme,
      description: tpl.description,
      churnRisk,
      confidence: sourceIds.length > 1 || rng() > 0.28 ? "High" : "Low",
      createdAt: ts,
      sourceIds,
      excerpt: quote,
    });
  }

  return { sources, feedback };
}

const dataset = buildDataset();

export const sourceItems: SourceItem[] = dataset.sources;
export const feedbackItems: FeedbackItem[] = dataset.feedback;

export const productById = new Map(products.map((p) => [p.id, p]));
export const customerById = new Map(customers.map((c) => [c.id, c]));
export const sourceById = new Map(sourceItems.map((s) => [s.id, s]));
export const productLineById = new Map(productLines.map((l) => [l.id, l]));
