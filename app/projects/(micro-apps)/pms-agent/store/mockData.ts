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

export type CheckInChannel = "SLACK" | "LINE";
export type CheckInStatus = "PENDING" | "SUBMITTED";
export type DriftSeverity = "ON_TRACK" | "AT_RISK" | "CRITICAL_DRIFT";

export interface MonthlyCheckIn {
  id: string;
  goalId: string;
  employeeId: string;
  cycleMonth: number;
  monthLabel: string;
  channel: CheckInChannel;
  botPrompt: string;
  employeeReply: string;
  reportedValue: number;
  status: CheckInStatus;
  createdAt: string;
}

export interface EvidenceItem {
  id: string;
  goalId: string;
  employeeId: string;
  sourceType: KpiBinding["dataSourceType"];
  metricSnapshot: number;
  summary: string;
  verifiedUri: string;
  capturedAt: string;
}

export interface DriftAlert {
  id: string;
  goalId: string;
  employeeId: string;
  severity: DriftSeverity;
  progressPct: number;
  expectedPct: number;
  driftDeltaPct: number;
  message: string;
  acknowledged: boolean;
  createdAt: string;
}

export type EvaluationStatus =
  | "AI_DRAFT"
  | "SELF_REVIEW_SUBMITTED"
  | "ENDORSED_MANAGER"
  | "DISPUTED";

export type ConfidenceTier = "HIGH" | "LOW";

export interface EvaluationRecord {
  id: string;
  goalId: string;
  employeeId: string;
  proposedScore: number;
  managerScore: number | null;
  confidenceScore: number;
  confidenceTier: ConfidenceTier;
  progressPct: number;
  aiSelfReviewDraft: string;
  employeeSelfReview: string;
  aiRationale: string;
  managerNote: string;
  appealNote: string;
  citedEvidenceIds: string[];
  status: EvaluationStatus;
  endorsedBy: string | null;
  piiMaskedSnapshot: boolean;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  goalId: string;
  employeeId: string;
  actorRole: "AI_AGENT" | "EMPLOYEE" | "MANAGER" | "EXECUTIVE";
  action:
    | "AI_EVALUATION_DRAFTED"
    | "SELF_REVIEW_SUBMITTED"
    | "MANAGER_SCORE_ENDORSED"
    | "MANAGER_SCORE_OVERRIDDEN"
    | "EMPLOYEE_APPEAL_RAISED"
    | "CALIBRATION_COMMITTEE_DECIDED";
  detail: string;
  timestamp: string;
}

export type BusinessUnitScope = "ALL" | "Engineering" | "Sales" | "Operations";

export type CalibrationDecisionStatus =
  | "FLAGGED"
  | "EXECUTIVE_APPROVED"
  | "COMMITTEE_ADJUSTED";

export type ManagerSkewStatus =
  | "BALANCED"
  | "LENIENCY_SKEW"
  | "STRICTNESS_SKEW";

export interface CalibrationDecision {
  goalId: string;
  status: CalibrationDecisionStatus;
  calibratedScore: number | null;
  committeeNote: string;
  updatedAt: string;
}

export interface BellCurveBucket {
  key: "EXCEEDS" | "STRONG" | "MEETS" | "BELOW";
  label: string;
  rangeLabel: string;
  targetPct: number;
  actualPct: number;
  count: number;
  deltaPct: number;
}

export interface ManagerBiasSummary {
  department: EmployeeProfile["department"];
  evaluatedCount: number;
  meanDelta: number;
  skewStatus: ManagerSkewStatus;
  flaggedExceptions: number;
  recommendation: string;
}

export interface CalibrationAnomalyCase {
  evaluationId: string;
  goalId: string;
  employeeId: string;
  displayIdentity: string;
  department: EmployeeProfile["department"];
  proposedScore: number;
  managerScore: number | null;
  effectiveScore: number;
  deltaFromAi: number;
  anomalyReason: string;
  decisionStatus: CalibrationDecisionStatus;
  calibratedScore: number | null;
  committeeNote: string;
}

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

export const INITIAL_CHECKINS: MonthlyCheckIn[] = [
  {
    id: "chk-eng-m3",
    goalId: "goal-eng-01",
    employeeId: "emp-eng-01",
    cycleMonth: 3,
    monthLabel: "Month 3 Check-in",
    channel: "SLACK",
    botPrompt:
      "[PMS Bot -> ENG_ANON_8832] สวัสดีเดือนที่ 3: เป้าหมาย PR Cycle Time (เป้า 18 Hours) ตอนนี้อัปเดตความคืบหน้าสั้นๆ เป็นอย่างไรบ้างครับ",
    employeeReply:
      "เปิดใช้ PR template ใหม่กับ auto-assign reviewer แล้ว ลดเวลารอเหลือราว 30 ชม.",
    reportedValue: 30,
    status: "SUBMITTED",
    createdAt: "2026-11-13T10:00:00.000Z",
  },
  {
    id: "chk-sal-m3",
    goalId: "goal-sal-01",
    employeeId: "emp-sal-02",
    cycleMonth: 3,
    monthLabel: "Month 3 Check-in",
    channel: "LINE",
    botPrompt:
      "[PMS LINE Bot -> SAL_ANON_4419] ติดตามผลเดือนที่ 3: Deal Closing Duration ปัจจุบันอยู่ประมาณกี่วันและติดปัญหาตรงขั้นตอนไหนครับ",
    employeeReply: "",
    reportedValue: 56,
    status: "PENDING",
    createdAt: "2026-11-13T11:30:00.000Z",
  },
  {
    id: "chk-ops-m3",
    goalId: "goal-ops-01",
    employeeId: "emp-ops-03",
    cycleMonth: 3,
    monthLabel: "Month 3 Check-in",
    channel: "LINE",
    botPrompt:
      "[PMS LINE Bot -> OPS_ANON_1120] สรุป SLA การจัดส่งประจำเดือนที่ 3 เป็นอย่างไรบ้างครับ",
    employeeReply: "ปรับรอบจัดส่งเช้ากับบ่ายแล้ว SLA ขยับมาแถว 91.5% แต่ปลายเดือนยังแน่น",
    reportedValue: 91.5,
    status: "SUBMITTED",
    createdAt: "2026-11-13T12:15:00.000Z",
  },
];

export const INITIAL_EVIDENCES: EvidenceItem[] = [
  {
    id: "ev-eng-01",
    goalId: "goal-eng-01",
    employeeId: "emp-eng-01",
    sourceType: "GIT",
    metricSnapshot: 30,
    summary:
      "GitHub Actions Telemetry: ค่าเฉลี่ย PR merge cycle ลดลงจาก 48.0 Hours เหลือ 30.0 Hours (คืบหน้า 60%)",
    verifiedUri: "github://rsxyz/core-repo/metrics/cycle-time#m3",
    capturedAt: "2026-11-13T10:05:00.000Z",
  },
  {
    id: "ev-sal-01",
    goalId: "goal-sal-01",
    employeeId: "emp-sal-02",
    sourceType: "ODOO",
    metricSnapshot: 56,
    summary:
      "Odoo CRM Snapshot: ระยะเวลาปิดดีลเฉลี่ยอยู่ที่ 56.0 Days (Baseline 62.0 -> Target 35.0 Days) ติดค้างขั้นตอน Legal Review",
    verifiedUri: "odoo://crm/leads/lead_time_analytics#m3",
    capturedAt: "2026-11-13T11:35:00.000Z",
  },
  {
    id: "ev-ops-01",
    goalId: "goal-ops-01",
    employeeId: "emp-ops-03",
    sourceType: "TICKETS",
    metricSnapshot: 91.5,
    summary:
      "ERP Warehouse Log: On-Time Dispatch SLA อยู่ที่ 91.5% (Baseline 88.0% -> Target 98.0%)",
    verifiedUri: "erp://warehouse/fulfillment/monthly-sla#m3",
    capturedAt: "2026-11-13T12:20:00.000Z",
  },
];

export const INITIAL_DRIFT_ALERTS: DriftAlert[] = [
  {
    id: "drift-goal-eng-01",
    goalId: "goal-eng-01",
    employeeId: "emp-eng-01",
    severity: "ON_TRACK",
    progressPct: 60,
    expectedPct: 50,
    driftDeltaPct: 10,
    message:
      "อยู่ในเกณฑ์ดี (+10% เทียบเป้าเดือนที่ 3): Average PR Cycle Time อยู่ที่ 30 Hours จากฐาน 48 Hours",
    acknowledged: true,
    createdAt: "2026-11-13T10:05:00.000Z",
  },
  {
    id: "drift-goal-sal-01",
    goalId: "goal-sal-01",
    employeeId: "emp-sal-02",
    severity: "CRITICAL_DRIFT",
    progressPct: 22,
    expectedPct: 50,
    driftDeltaPct: -28,
    message:
      "เตือนระดับวิกฤต (-28% เทียบเป้าเดือนที่ 3): Enterprise Deal Closing Duration อยู่ที่ 56 Days แนะนำให้หัวหน้าตรวจคอขวดจาก odoo://crm/leads/lead_time_analytics",
    acknowledged: false,
    createdAt: "2026-11-13T11:35:00.000Z",
  },
  {
    id: "drift-goal-ops-01",
    goalId: "goal-ops-01",
    employeeId: "emp-ops-03",
    severity: "AT_RISK",
    progressPct: 35,
    expectedPct: 50,
    driftDeltaPct: -15,
    message:
      "เริ่มต่ำกว่าแผน (-15% เทียบเป้าเดือนที่ 3): On-Time Dispatch SLA อยู่ที่ 91.5% จากฐาน 88% แนะนำติดตามข้อมูลจาก erp://warehouse/fulfillment/monthly-sla",
    acknowledged: false,
    createdAt: "2026-11-13T12:20:00.000Z",
  },
];

export const INITIAL_EVALUATIONS: EvaluationRecord[] = [
  {
    id: "eval-goal-eng-01",
    goalId: "goal-eng-01",
    employeeId: "emp-eng-01",
    proposedScore: 3.1,
    managerScore: null,
    confidenceScore: 0.86,
    confidenceTier: "HIGH",
    progressPct: 60,
    aiSelfReviewDraft:
      '[AI Self-Review Draft for ENG_ANON_8832 · Goal: Reduce Average PR Cycle Time by 50%]\nสรุปผลลัพธ์: ดำเนินงานตามตัวชี้วัด Average PR Cycle Time จากค่าเริ่มต้น 48 Hours มาอยู่ที่ 30 Hours เทียบกับเป้าหมาย 18 Hours (คืบหน้า 60%)\nหลักฐานประกอบจากระบบ (1 รายการ):\n[1] GitHub Actions Telemetry: ค่าเฉลี่ย PR merge cycle ลดลงจาก 48.0 Hours เหลือ 30.0 Hours (คืบหน้า 60%) (URI: github://rsxyz/core-repo/metrics/cycle-time#m3)\nบันทึกการติดตามล่าสุด: "เปิดใช้ PR template ใหม่กับ auto-assign reviewer แล้ว ลดเวลารอเหลือราว 30 ชม."',
    employeeSelfReview:
      '[AI Self-Review Draft for ENG_ANON_8832 · Goal: Reduce Average PR Cycle Time by 50%]\nสรุปผลลัพธ์: ดำเนินงานตามตัวชี้วัด Average PR Cycle Time จากค่าเริ่มต้น 48 Hours มาอยู่ที่ 30 Hours เทียบกับเป้าหมาย 18 Hours (คืบหน้า 60%)\nหลักฐานประกอบจากระบบ (1 รายการ):\n[1] GitHub Actions Telemetry: ค่าเฉลี่ย PR merge cycle ลดลงจาก 48.0 Hours เหลือ 30.0 Hours (คืบหน้า 60%) (URI: github://rsxyz/core-repo/metrics/cycle-time#m3)\nบันทึกการติดตามล่าสุด: "เปิดใช้ PR template ใหม่กับ auto-assign reviewer แล้ว ลดเวลารอเหลือราว 30 ชม."',
    aiRationale:
      "AI เสนอคะแนน 3.1/5.0 จากความคืบหน้า 60% ของตัวชี้วัด Average PR Cycle Time | ค่า Baseline 48 Hours -> ค่าล่าสุด 30 Hours (เป้าหมาย 18 Hours) | ความมั่นใจระดับ HIGH (86%) พร้อมหลักฐานยืนยัน 1 รายการ และ Check-in ที่ส่งแล้ว 1 ครั้ง: เหมาะสำหรับหัวหน้ากดยืนยันแบบ 1-Click",
    managerNote: "",
    appealNote: "",
    citedEvidenceIds: ["ev-eng-01"],
    status: "AI_DRAFT",
    endorsedBy: null,
    piiMaskedSnapshot: true,
    updatedAt: "2026-11-13T18:00:00.000Z",
  },
  {
    id: "eval-goal-sal-01",
    goalId: "goal-sal-01",
    employeeId: "emp-sal-02",
    proposedScore: 2.2,
    managerScore: null,
    confidenceScore: 0.8,
    confidenceTier: "LOW",
    progressPct: 22,
    aiSelfReviewDraft:
      "[AI Self-Review Draft for SAL_ANON_4419 · Goal: Expand Tier-1 Enterprise Accounts & Accelerate Contract Velocity]\nสรุปผลลัพธ์: ดำเนินงานตามตัวชี้วัด Enterprise Deal Closing Duration จากค่าเริ่มต้น 62 Days มาอยู่ที่ 56 Days เทียบกับเป้าหมาย 35 Days (คืบหน้า 22%)\nหลักฐานประกอบจากระบบ (1 รายการ):\n[1] Odoo CRM Snapshot: ระยะเวลาปิดดีลเฉลี่ยอยู่ที่ 56.0 Days (Baseline 62.0 -> Target 35.0 Days) ติดค้างขั้นตอน Legal Review (URI: odoo://crm/leads/lead_time_analytics#m3)\nหมายเหตุ: ยังรอคำตอบ Monthly Check-in เพิ่มเติมจากพนักงานเพื่อเสริมความสมบูรณ์ของหลักฐาน",
    employeeSelfReview:
      "[AI Self-Review Draft for SAL_ANON_4419 · Goal: Expand Tier-1 Enterprise Accounts & Accelerate Contract Velocity]\nสรุปผลลัพธ์: ดำเนินงานตามตัวชี้วัด Enterprise Deal Closing Duration จากค่าเริ่มต้น 62 Days มาอยู่ที่ 56 Days เทียบกับเป้าหมาย 35 Days (คืบหน้า 22%)\nหลักฐานประกอบจากระบบ (1 รายการ):\n[1] Odoo CRM Snapshot: ระยะเวลาปิดดีลเฉลี่ยอยู่ที่ 56.0 Days (Baseline 62.0 -> Target 35.0 Days) ติดค้างขั้นตอน Legal Review (URI: odoo://crm/leads/lead_time_analytics#m3)\nหมายเหตุ: ยังรอคำตอบ Monthly Check-in เพิ่มเติมจากพนักงานเพื่อเสริมความสมบูรณ์ของหลักฐาน",
    aiRationale:
      "AI เสนอคะแนน 2.2/5.0 จากความคืบหน้า 22% ของตัวชี้วัด Enterprise Deal Closing Duration | ค่า Baseline 62 Days -> ค่าล่าสุด 56 Days (เป้าหมาย 35 Days) | ความมั่นใจระดับ LOW (80%) เนื่องจากหลักฐานหรือ Check-in ยังไม่สมบูรณ์ (1 evidence / 0 check-in): แนะนำให้หัวหน้าตรวจสอบรายละเอียดก่อนรับรอง",
    managerNote: "",
    appealNote: "",
    citedEvidenceIds: ["ev-sal-01"],
    status: "AI_DRAFT",
    endorsedBy: null,
    piiMaskedSnapshot: true,
    updatedAt: "2026-11-13T18:00:00.000Z",
  },
  {
    id: "eval-goal-ops-01",
    goalId: "goal-ops-01",
    employeeId: "emp-ops-03",
    proposedScore: 2.6,
    managerScore: null,
    confidenceScore: 0.86,
    confidenceTier: "HIGH",
    progressPct: 35,
    aiSelfReviewDraft:
      '[AI Self-Review Draft for OPS_ANON_1120 · Goal: Elevate Warehouse On-Time Dispatch SLA to 98%]\nสรุปผลลัพธ์: ดำเนินงานตามตัวชี้วัด On-Time Dispatch SLA จากค่าเริ่มต้น 88 % มาอยู่ที่ 91.5 % เทียบกับเป้าหมาย 98 % (คืบหน้า 35%)\nหลักฐานประกอบจากระบบ (1 รายการ):\n[1] ERP Warehouse Log: On-Time Dispatch SLA อยู่ที่ 91.5% (Baseline 88.0% -> Target 98.0%) (URI: erp://warehouse/fulfillment/monthly-sla#m3)\nบันทึกการติดตามล่าสุด: "ปรับรอบจัดส่งเช้ากับบ่ายแล้ว SLA ขยับมาแถว 91.5% แต่ปลายเดือนยังแน่น"',
    employeeSelfReview:
      '[AI Self-Review Draft for OPS_ANON_1120 · Goal: Elevate Warehouse On-Time Dispatch SLA to 98%]\nสรุปผลลัพธ์: ดำเนินงานตามตัวชี้วัด On-Time Dispatch SLA จากค่าเริ่มต้น 88 % มาอยู่ที่ 91.5 % เทียบกับเป้าหมาย 98 % (คืบหน้า 35%)\nหลักฐานประกอบจากระบบ (1 รายการ):\n[1] ERP Warehouse Log: On-Time Dispatch SLA อยู่ที่ 91.5% (Baseline 88.0% -> Target 98.0%) (URI: erp://warehouse/fulfillment/monthly-sla#m3)\nบันทึกการติดตามล่าสุด: "ปรับรอบจัดส่งเช้ากับบ่ายแล้ว SLA ขยับมาแถว 91.5% แต่ปลายเดือนยังแน่น"',
    aiRationale:
      "AI เสนอคะแนน 2.6/5.0 จากความคืบหน้า 35% ของตัวชี้วัด On-Time Dispatch SLA | ค่า Baseline 88 % -> ค่าล่าสุด 91.5 % (เป้าหมาย 98 %) | ความมั่นใจระดับ HIGH (86%) พร้อมหลักฐานยืนยัน 1 รายการ และ Check-in ที่ส่งแล้ว 1 ครั้ง: เหมาะสำหรับหัวหน้ากดยืนยันแบบ 1-Click",
    managerNote: "",
    appealNote: "",
    citedEvidenceIds: ["ev-ops-01"],
    status: "AI_DRAFT",
    endorsedBy: null,
    piiMaskedSnapshot: true,
    updatedAt: "2026-11-13T18:00:00.000Z",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-init-eng-01",
    goalId: "goal-eng-01",
    employeeId: "emp-eng-01",
    actorRole: "AI_AGENT",
    action: "AI_EVALUATION_DRAFTED",
    detail:
      "Synthesized evaluation proposal (3.1/5.0, HIGH confidence) from ev-eng-01 with PII redaction [ENG_ANON_8832].",
    timestamp: "2026-11-13T18:00:00.000Z",
  },
  {
    id: "audit-init-sal-01",
    goalId: "goal-sal-01",
    employeeId: "emp-sal-02",
    actorRole: "AI_AGENT",
    action: "AI_EVALUATION_DRAFTED",
    detail:
      "Synthesized evaluation proposal (2.2/5.0, LOW confidence - pending check-in) from ev-sal-01 with PII redaction [SAL_ANON_4419].",
    timestamp: "2026-11-13T18:00:00.000Z",
  },
  {
    id: "audit-init-ops-01",
    goalId: "goal-ops-01",
    employeeId: "emp-ops-03",
    actorRole: "AI_AGENT",
    action: "AI_EVALUATION_DRAFTED",
    detail:
      "Synthesized evaluation proposal (2.6/5.0, HIGH confidence) from ev-ops-01 with PII redaction [OPS_ANON_1120].",
    timestamp: "2026-11-13T18:00:00.000Z",
  },
];

export const INITIAL_CALIBRATION_DECISIONS: Record<
  string,
  CalibrationDecision
> = {};
