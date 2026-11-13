export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  department: "Engineering" | "Sales" | "Operations";
  band: string;
  avatarUrl: string;
  anonymizedId: string;
}

export interface CompanyOkr {
  id: string;
  title: string;
  keyResult: string;
  cycle: string;
}

export interface DepartmentIssue {
  id: string;
  department: "Engineering" | "Sales" | "Operations";
  title: string;
  source: string;
  impact: string;
}

export interface KpiBinding {
  kpiId: string;
  metricName: string;
  baselineValue: number;
  targetValue: number;
  unit: string;
  dataSourceType: "GIT" | "TICKETS" | "ODOO" | "MANUAL_CHECK";
  dataSourceUri: string;
}

export interface SmartValidation {
  specific: boolean;
  measurable: boolean;
  achievable: boolean;
  relevant: boolean;
  timeBound: boolean;
  score: number;
  critique: string[];
}

export type GoalStatus = "DRAFT_AI" | "ENDORSED_MANAGER" | "CONFIRMED_EMPLOYEE";

export interface GoalDraft {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  okrAlignment: string;
  departmentProblem: string;
  kpiBinding: KpiBinding;
  smartValidation: SmartValidation;
  confidenceScore: number;
  status: GoalStatus;
  updatedAt: string;
}

export const MOCK_COMPANY_OKRS: CompanyOkr[] = [
  {
    id: "okr-1",
    title: "Accelerate Technical Modernization & Resilience",
    keyResult:
      "Reduce critical incident resolution time by 40% and accelerate deployment velocity.",
    cycle: "Q1-Q2 2026",
  },
  {
    id: "okr-2",
    title: "Enterprise Market & Revenue Expansion",
    keyResult:
      "Grow high-margin enterprise recurring contracts by 25% across Southeast Asia.",
    cycle: "Q1-Q2 2026",
  },
  {
    id: "okr-3",
    title: "Operational Excellence & Fulfillment Reliability",
    keyResult:
      "Achieve 98% on-time fulfillment SLA and reduce return/dispute rate below 1.5%.",
    cycle: "Q1-Q2 2026",
  },
];

export const MOCK_EMPLOYEES: EmployeeProfile[] = [
  {
    id: "emp-eng-01",
    name: "Somchai Techlead",
    role: "Lead Software Engineer",
    department: "Engineering",
    band: "L4",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    anonymizedId: "ENG_ANON_8832",
  },
  {
    id: "emp-sal-02",
    name: "Nicha Enterprise",
    role: "Senior Account Executive",
    department: "Sales",
    band: "L3",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    anonymizedId: "SAL_ANON_4419",
  },
  {
    id: "emp-ops-03",
    name: "Kittisak Logistics",
    role: "Logistics Fulfillment Specialist",
    department: "Operations",
    band: "L3",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    anonymizedId: "OPS_ANON_1120",
  },
];

export const MOCK_DEPARTMENT_ISSUES: DepartmentIssue[] = [
  {
    id: "issue-eng-1",
    department: "Engineering",
    title: "High pull-request cycle time (48h bottleneck on code reviews)",
    source: "GitHub Actions / Jira Backlog",
    impact: "Slows feature delivery and delays critical client fixes.",
  },
  {
    id: "issue-sal-1",
    department: "Sales",
    title:
      "Lengthy contract negotiation cycle in enterprise tier (avg 62 days)",
    source: "Odoo CRM / Sales Pipeline",
    impact: "Hinders quarterly quota attainment for strategic clients.",
  },
  {
    id: "issue-ops-1",
    department: "Operations",
    title:
      "Dispatch delay spikes during month-end inventory turnover (88% SLA)",
    source: "ERP Warehouse Dispatches",
    impact: "Causes customer support ticket surges on late arrivals.",
  },
];

export const INITIAL_GOAL_DRAFTS: GoalDraft[] = [
  {
    id: "goal-eng-01",
    employeeId: "emp-eng-01",
    title: "Accelerate CI/CD Code Review & Deployment Cycle Time",
    description:
      "Streamline peer review workflows and implement automated regression gates to shrink PR latency without compromising test coverage.",
    okrAlignment: "Accelerate Technical Modernization & Resilience",
    departmentProblem:
      "High pull-request cycle time (48h bottleneck on code reviews)",
    kpiBinding: {
      kpiId: "kpi-pr-cycle",
      metricName: "Average PR Cycle Time",
      baselineValue: 48.0,
      targetValue: 18.0,
      unit: "Hours",
      dataSourceType: "GIT",
      dataSourceUri: "github://rsxyz/core-repo/metrics/cycle-time",
    },
    smartValidation: {
      specific: true,
      measurable: true,
      achievable: true,
      relevant: true,
      timeBound: true,
      score: 96,
      critique: [
        "Clearly defined measurable metric (18 hours target).",
        "Directly aligned with Corporate OKR 1.",
        "Bounded within Q1-Q2 cycle.",
      ],
    },
    confidenceScore: 0.94,
    status: "DRAFT_AI",
    updatedAt: "2026-11-13T21:40:00.000Z",
  },
  {
    id: "goal-sal-01",
    employeeId: "emp-sal-02",
    title: "Expand Tier-1 Enterprise Accounts & Accelerate Contract Velocity",
    description:
      "Target key enterprise prospects in retail and fintech sectors while standardizing legal review SLAs to reduce deal closing cycles.",
    okrAlignment: "Enterprise Market & Revenue Expansion",
    departmentProblem:
      "Lengthy contract negotiation cycle in enterprise tier (avg 62 days)",
    kpiBinding: {
      kpiId: "kpi-deal-cycle",
      metricName: "Enterprise Deal Closing Duration",
      baselineValue: 62.0,
      targetValue: 35.0,
      unit: "Days",
      dataSourceType: "ODOO",
      dataSourceUri: "odoo://crm/leads/lead_time_analytics",
    },
    smartValidation: {
      specific: true,
      measurable: true,
      achievable: true,
      relevant: true,
      timeBound: true,
      score: 92,
      critique: [
        "Concrete day-count target with historical baseline from Odoo.",
        "Supports company revenue expansion goal.",
      ],
    },
    confidenceScore: 0.89,
    status: "DRAFT_AI",
    updatedAt: "2026-11-13T21:40:00.000Z",
  },
  {
    id: "goal-ops-01",
    employeeId: "emp-ops-03",
    title: "Elevate Warehouse On-Time Dispatch SLA to 98%",
    description:
      "Optimize batch pick-and-pack routing and automate shipment labeling during peak volume days to guarantee same-day dispatch.",
    okrAlignment: "Operational Excellence & Fulfillment Reliability",
    departmentProblem:
      "Dispatch delay spikes during month-end inventory turnover (88% SLA)",
    kpiBinding: {
      kpiId: "kpi-dispatch-sla",
      metricName: "On-Time Dispatch SLA",
      baselineValue: 88.0,
      targetValue: 98.0,
      unit: "%",
      dataSourceType: "TICKETS",
      dataSourceUri: "erp://warehouse/fulfillment/monthly-sla",
    },
    smartValidation: {
      specific: true,
      measurable: true,
      achievable: true,
      relevant: true,
      timeBound: true,
      score: 95,
      critique: [
        "Quantitative SLA bound to warehouse ERP telemetry.",
        "Directly resolves recurring month-end customer complaints.",
      ],
    },
    confidenceScore: 0.96,
    status: "DRAFT_AI",
    updatedAt: "2026-11-13T21:40:00.000Z",
  },
];
