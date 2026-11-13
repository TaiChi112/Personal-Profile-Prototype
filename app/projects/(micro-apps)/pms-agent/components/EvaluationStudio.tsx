"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileText,
  History,
  MessageSquareWarning,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MOCK_EMPLOYEES } from "../store/mockData";
import { usePmsStore } from "../store/usePmsStore";

export function EvaluationStudio() {
  const {
    selectedEmployeeId,
    goals,
    evidences,
    evaluations,
    auditLogs,
    maskPii,
    synthesizeEmployeeEvaluation,
    saveEmployeeSelfReview,
    endorseEvaluation,
    submitEvaluationAppeal,
  } = usePmsStore();

  const employee =
    MOCK_EMPLOYEES.find((e) => e.id === selectedEmployeeId) ||
    MOCK_EMPLOYEES[0];

  const employeeEvaluations = evaluations.filter(
    (ev) => ev.employeeId === employee.id,
  );
  const employeeAuditLogs = auditLogs.filter(
    (log) => log.employeeId === employee.id,
  );

  const [reviewDrafts, setReviewDrafts] = useState<Record<string, string>>({});
  const [overrideScores, setOverrideScores] = useState<Record<string, string>>(
    {},
  );
  const [managerNotes, setManagerNotes] = useState<Record<string, string>>({});
  const [appealNotes, setAppealNotes] = useState<Record<string, string>>({});
  const [showAppealFor, setShowAppealFor] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const nextReviews: Record<string, string> = {};
    const nextScores: Record<string, string> = {};
    const nextNotes: Record<string, string> = {};

    for (const item of employeeEvaluations) {
      nextReviews[item.id] = item.employeeSelfReview;
      nextScores[item.id] = String(item.managerScore ?? item.proposedScore);
      nextNotes[item.id] = item.managerNote;
    }

    setReviewDrafts(nextReviews);
    setOverrideScores(nextScores);
    setManagerNotes(nextNotes);
  }, [selectedEmployeeId, evaluations]);

  const handleResynthesize = () => {
    synthesizeEmployeeEvaluation(employee.id);
  };

  const handleSubmitSelfReview = (evaluationId: string) => {
    const text = reviewDrafts[evaluationId] ?? "";
    saveEmployeeSelfReview(evaluationId, text, true);
  };

  const handleOneClickEndorse = (evaluationId: string) => {
    const note = managerNotes[evaluationId]?.trim();
    endorseEvaluation(evaluationId, undefined, note || undefined);
  };

  const handleOverrideEndorse = (
    evaluationId: string,
    fallbackScore: number,
  ) => {
    const parsedScore = Number(overrideScores[evaluationId]);
    const finalScore = Number.isFinite(parsedScore)
      ? parsedScore
      : fallbackScore;
    const note =
      managerNotes[evaluationId]?.trim() || "Manager Calibration Override";
    endorseEvaluation(evaluationId, finalScore, note);
  };

  const handleRaiseAppeal = (evaluationId: string) => {
    const note = appealNotes[evaluationId]?.trim() ?? "";
    submitEvaluationAppeal(evaluationId, note);
    setShowAppealFor((prev) => ({ ...prev, [evaluationId]: false }));
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Phase 3 Top Header: Evidence Synthesis & Effort Shift */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>Phase 3: Evidence-Grounded Evaluation &amp; Self-Review</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            สังเคราะห์ผลประเมินจากหลักฐานจริง, Self-Review Assistant และ Manager HITL
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Effort Shift: ลดงานหาหลักฐานและร่างประเมินเอง (80%)
            เหลือเพียงตรวจสอบและรับรองคะแนน (20%)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {maskPii
                ? `PII Masked: ${employee.anonymizedId}`
                : `Identity: ${employee.name}`}
            </span>
          </span>

          <button
            type="button"
            onClick={handleResynthesize}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-synthesize from Cycle Evidence</span>
          </button>
        </div>
      </div>

      {/* Evaluation Cards */}
      <div className="grid grid-cols-1 gap-6">
        {employeeEvaluations.map((evalItem) => {
          const goal = goals.find((g) => g.id === evalItem.goalId);
          const citedEvidences = evidences.filter((ev) =>
            evalItem.citedEvidenceIds.includes(ev.id),
          );
          const isHighConfidence = evalItem.confidenceTier === "HIGH";
          const isEndorsed = evalItem.status === "ENDORSED_MANAGER";
          const isDisputed = evalItem.status === "DISPUTED";

          const statusBadgeClass = isEndorsed
            ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
            : isDisputed
              ? "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
              : evalItem.status === "SELF_REVIEW_SUBMITTED"
                ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

          return (
            <article
              key={evalItem.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeClass}`}
                    >
                      {evalItem.status}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isHighConfidence
                          ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                      }`}
                    >
                      {isHighConfidence
                        ? `HIGH CONFIDENCE (${Math.round(evalItem.confidenceScore * 100)}%) · 1-Click Ready`
                        : `LOW CONFIDENCE (${Math.round(evalItem.confidenceScore * 100)}%) · Inspect Detail`}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {goal ? goal.title : evalItem.goalId}
                  </h3>
                  {goal && (
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      KPI: {goal.kpiBinding.metricName} (
                      {goal.kpiBinding.baselineValue} -&gt;{" "}
                      {goal.kpiBinding.targetValue} {goal.kpiBinding.unit})
                    </p>
                  )}
                </div>

                {/* Score Comparison Box */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      AI Proposed
                    </span>
                    <span className="text-xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
                      {evalItem.proposedScore.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400">/5.0</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      Manager HITL
                    </span>
                    <span className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {evalItem.managerScore !== null
                        ? evalItem.managerScore.toFixed(1)
                        : "--"}
                    </span>
                    <span className="text-[10px] text-slate-400">/5.0</span>
                  </div>
                </div>
              </div>

              {/* AI Rationale & Progress */}
              <div className="bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/60 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 flex flex-col gap-2">
                <div className="flex items-center justify-between font-semibold text-purple-700 dark:text-purple-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Evidence-Grounded Rationale</span>
                  </span>
                  <span className="font-mono">
                    KPI Progress: {evalItem.progressPct}%
                  </span>
                </div>
                <p className="leading-relaxed">{evalItem.aiRationale}</p>
              </div>

              {/* Two-column Workspace: Cited Evidences + Self-Review Assistant */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left 5 cols: Cited Evidence Trail */}
                <div className="lg:col-span-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        Cited Cycle Evidence ({citedEvidences.length})
                      </span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Read-only Transparency
                    </span>
                  </div>

                  {citedEvidences.length > 0 ? (
                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                      {citedEvidences.map((ev) => (
                        <div
                          key={ev.id}
                          className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/70 dark:bg-slate-800/40 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                              {ev.sourceType} · Metric: {ev.metricSnapshot}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {ev.id}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">
                            {ev.summary}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                            {ev.verifiedUri}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-amber-300 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-300 bg-amber-50/40 dark:bg-amber-950/20 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        ยังไม่พบหลักฐานเชื่อมโยง กรุณากด Sync Telemetry ใน Phase 2
                        แล้วกด Re-synthesize
                      </span>
                    </div>
                  )}
                </div>

                {/* Right 7 cols: Employee Self-Review Assistant */}
                <div className="lg:col-span-7 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`self-review-${evalItem.id}`}
                      className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>AI-Assisted Employee Self-Review Draft</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {evalItem.piiMaskedSnapshot
                        ? "Generated with PII Redaction"
                        : "Identity Unmasked"}
                    </span>
                  </div>

                  <textarea
                    id={`self-review-${evalItem.id}`}
                    aria-label={`Self review for ${evalItem.goalId}`}
                    rows={5}
                    value={
                      reviewDrafts[evalItem.id] ?? evalItem.employeeSelfReview
                    }
                    onChange={(e) =>
                      setReviewDrafts((prev) => ({
                        ...prev,
                        [evalItem.id]: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleSubmitSelfReview(evalItem.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Submit Self-Review</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAppealFor((prev) => ({
                          ...prev,
                          [evalItem.id]: !prev[evalItem.id],
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <MessageSquareWarning className="w-3.5 h-3.5 text-rose-500" />
                      <span>Request Review / Appeal</span>
                    </button>
                  </div>

                  {showAppealFor[evalItem.id] && (
                    <div className="mt-1 p-3 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col gap-2">
                      <input
                        type="text"
                        aria-label="Appeal reason"
                        placeholder="ระบุเหตุผลหรือหลักฐานเพิ่มเติมที่ต้องการให้หัวหน้าทบทวน..."
                        value={appealNotes[evalItem.id] ?? ""}
                        onChange={(e) =>
                          setAppealNotes((prev) => ({
                            ...prev,
                            [evalItem.id]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRaiseAppeal(evalItem.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                        >
                          Submit Appeal
                        </button>
                      </div>
                    </div>
                  )}

                  {evalItem.appealNote && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                      Appeal Note: {evalItem.appealNote}
                    </p>
                  )}
                </div>
              </div>

              {/* Manager HITL Decision Bar */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
                  <label
                    htmlFor={`override-score-${evalItem.id}`}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Final Score:
                  </label>
                  <input
                    id={`override-score-${evalItem.id}`}
                    aria-label="Manager final score"
                    type="number"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={
                      overrideScores[evalItem.id] ??
                      String(evalItem.proposedScore)
                    }
                    onChange={(e) =>
                      setOverrideScores((prev) => ({
                        ...prev,
                        [evalItem.id]: e.target.value,
                      }))
                    }
                    className="w-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    aria-label="Manager rationale note"
                    placeholder="เหตุผลประกอบการรับรองหรือปรับแก้คะแนน (HITL Note)..."
                    value={managerNotes[evalItem.id] ?? ""}
                    onChange={(e) =>
                      setManagerNotes((prev) => ({
                        ...prev,
                        [evalItem.id]: e.target.value,
                      }))
                    }
                    className="flex-1 min-w-[200px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOneClickEndorse(evalItem.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Endorse AI Score (HITL)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleOverrideEndorse(evalItem.id, evalItem.proposedScore)
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all cursor-pointer"
                  >
                    <span>Override &amp; Endorse</span>
                  </button>
                </div>
              </div>

              {evalItem.endorsedBy && (
                <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Signed off by {evalItem.endorsedBy} (Final Score:{" "}
                    {evalItem.managerScore?.toFixed(1)}/5.0)
                    {evalItem.managerNote
                      ? ` · Note: ${evalItem.managerNote}`
                      : ""}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Layer 5 Audit Ledger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span>Governance Audit Ledger (agent_audit_logs)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {employeeAuditLogs.length} events
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
          {employeeAuditLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-wrap items-center justify-between gap-2 text-xs border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50/70 dark:bg-slate-800/40"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  {log.actorRole}
                </span>
                <span className="font-mono font-semibold text-purple-700 dark:text-purple-300">
                  {log.action}
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {log.detail}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {log.timestamp.slice(0, 19).replace("T", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
