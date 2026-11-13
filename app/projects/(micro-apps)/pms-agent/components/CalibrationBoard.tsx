"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import {
  analyzeManagerBias,
  buildCalibrationQueue,
  computeBellCurveDistribution,
} from "../engine/calibrationEngine";
import { type BusinessUnitScope, MOCK_EMPLOYEES } from "../store/mockData";
import { usePmsStore } from "../store/usePmsStore";

const BU_OPTIONS: BusinessUnitScope[] = [
  "ALL",
  "Engineering",
  "Sales",
  "Operations",
];

export function CalibrationBoard() {
  const {
    evaluations,
    calibrationBuFilter,
    calibrationDecisions,
    maskPii,
    auditLogs,
    setCalibrationBuFilter,
    resolveCalibrationCase,
  } = usePmsStore();

  const bellCurveBuckets = computeBellCurveDistribution(
    evaluations,
    MOCK_EMPLOYEES,
    calibrationBuFilter,
    calibrationDecisions,
  );
  const biasSummaries = analyzeManagerBias(
    evaluations,
    MOCK_EMPLOYEES,
    calibrationBuFilter,
  );
  const anomalyQueue = buildCalibrationQueue(
    evaluations,
    MOCK_EMPLOYEES,
    calibrationDecisions,
    maskPii,
    calibrationBuFilter,
  );

  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const nextScores: Record<string, string> = {};
    const nextNotes: Record<string, string> = {};
    for (const item of anomalyQueue) {
      nextScores[item.goalId] = String(item.effectiveScore);
      nextNotes[item.goalId] = item.committeeNote;
    }
    setScoreInputs(nextScores);
    setNoteInputs(nextNotes);
  }, [evaluations, calibrationDecisions, calibrationBuFilter]);

  const calibrationLogs = auditLogs.filter(
    (log) => log.action === "CALIBRATION_COMMITTEE_DECIDED",
  );

  const handleCommitteeAction = (
    goalId: string,
    status: "EXECUTIVE_APPROVED" | "COMMITTEE_ADJUSTED",
    fallbackScore: number,
  ) => {
    const parsed = Number(scoreInputs[goalId]);
    const score = Number.isFinite(parsed) ? parsed : fallbackScore;
    const note =
      noteInputs[goalId]?.trim() ||
      (status === "EXECUTIVE_APPROVED"
        ? "Executive Committee confirmed rating after evidence inspection."
        : "Executive Committee adjusted rating to align with BU Bell Curve.");
    resolveCalibrationCase(goalId, score, status, note);
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Top Executive Governance Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>Phase 4: Calibration Analytics &amp; Bias Detection</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            กระดานสอบเทียบผลประเมิน (BU Bell Curve), ตรวจความลำเอียง และ Executive
            HITL
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Effort Shift: ผู้บริหารโฟกัสเฉพาะเคสที่ AI ชี้ความผิดปกติ (28%)
            แทนการไล่ตรวจทุกคน (55%)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {maskPii
                ? "Calibration View: PII Masked"
                : "Calibration View: Names Revealed"}
            </span>
          </span>

          <div
            className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs"
            role="group"
            aria-label="Filter Calibration by BU"
          >
            {BU_OPTIONS.map((bu) => (
              <button
                key={bu}
                type="button"
                onClick={() => setCalibrationBuFilter(bu)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  calibrationBuFilter === bu
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                {bu}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Bell Curve Distribution + Manager Bias Detector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 6 cols: BU Bell Curve Distribution */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span>BU Bell Curve Alignment ({calibrationBuFilter})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Actual vs Organization Target %
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {bellCurveBuckets.map((bucket) => (
              <div key={bucket.key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {bucket.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({bucket.rangeLabel})
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    Actual: <strong>{bucket.actualPct}%</strong> ({bucket.count}
                    ) / Target: {bucket.targetPct}%
                  </div>
                </div>

                {/* Stacked comparison bars */}
                <div className="relative h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, bucket.actualPct)}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-white opacity-70"
                    style={{ left: `${bucket.targetPct}%` }}
                    title={`Target ${bucket.targetPct}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Manager Bias & Skew Detection */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-500" />
              <span>Manager Bias &amp; Skew Detector</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Manager vs AI Evidence Proposal
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {biasSummaries.map((bias) => {
              const badgeColor =
                bias.skewStatus === "LENIENCY_SKEW"
                  ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                  : bias.skewStatus === "STRICTNESS_SKEW"
                    ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                    : "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";

              return (
                <div
                  key={bias.department}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col gap-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {bias.department} BU
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
                      >
                        {bias.skewStatus}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Mean Delta: {bias.meanDelta >= 0 ? "+" : ""}
                      {bias.meanDelta.toFixed(2)} · Flagged:{" "}
                      {bias.flaggedExceptions}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {bias.recommendation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Executive HITL Anomaly Queue */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>
              AI-Flagged Calibration Anomalies (Executive HITL Queue ·{" "}
              {anomalyQueue.length})
            </span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Calibration Decisions Logged: {calibrationLogs.length}
          </span>
        </div>

        {anomalyQueue.length === 0 ? (
          <div className="border border-dashed border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20">
            ทุกเคสในขอบเขต {calibrationBuFilter}{" "}
            มีคะแนนตรงกับหลักฐานและผ่านการรับรองเรียบร้อยแล้ว
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {anomalyQueue.map((item) => {
              const isResolved = item.decisionStatus !== "FLAGGED";

              return (
                <article
                  key={item.goalId}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-800/30 flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.displayIdentity}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {item.department}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            isResolved
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {item.decisionStatus}
                        </span>
                      </div>
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
                        {item.anomalyReason}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">
                          AI Proposed
                        </span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {item.proposedScore.toFixed(1)}/5.0
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">
                          Manager HITL
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {item.managerScore !== null
                            ? `${item.managerScore.toFixed(1)}/5.0`
                            : "Pending"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">
                          Effective
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {item.effectiveScore.toFixed(1)}/5.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Executive Resolution Controls */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/70 dark:border-slate-700/70 pt-3">
                    <label
                      htmlFor={`cal-score-${item.goalId}`}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300"
                    >
                      Calibrated Score:
                    </label>
                    <input
                      id={`cal-score-${item.goalId}`}
                      aria-label={`Calibrated score for ${item.goalId}`}
                      type="number"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={
                        scoreInputs[item.goalId] ?? String(item.effectiveScore)
                      }
                      onChange={(e) =>
                        setScoreInputs((prev) => ({
                          ...prev,
                          [item.goalId]: e.target.value,
                        }))
                      }
                      className="w-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                    />

                    <input
                      type="text"
                      aria-label={`Committee note for ${item.goalId}`}
                      placeholder="บันทึกมติคณะกรรมการสอบเทียบ (Executive HITL Rationale)..."
                      value={noteInputs[item.goalId] ?? ""}
                      onChange={(e) =>
                        setNoteInputs((prev) => ({
                          ...prev,
                          [item.goalId]: e.target.value,
                        }))
                      }
                      className="flex-1 min-w-[200px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleCommitteeAction(
                          item.goalId,
                          "COMMITTEE_ADJUSTED",
                          item.effectiveScore,
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finalize Calibration (HITL)</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
