"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BellRing,
  Calendar,
  CheckCircle2,
  Database,
  MessageSquare,
  Send,
  ShieldCheck,
} from "lucide-react";
import { type CheckInChannel, MOCK_EMPLOYEES } from "../store/mockData";
import { usePmsStore } from "../store/usePmsStore";

export function InCycleTracker() {
  const {
    selectedEmployeeId,
    goals,
    maskPii,
    currentCycleMonth,
    checkIns,
    evidences,
    driftAlerts,
    setCycleMonth,
    triggerBotCheckIn,
    submitEmployeeCheckIn,
    ingestSourceTelemetry,
    acknowledgeDriftAlert,
  } = usePmsStore();

  const employee =
    MOCK_EMPLOYEES.find((e) => e.id === selectedEmployeeId) ||
    MOCK_EMPLOYEES[0];
  const employeeGoals = goals.filter((g) => g.employeeId === employee.id);
  const primaryGoal = employeeGoals[0];

  const [selectedChannel, setSelectedChannel] =
    useState<CheckInChannel>("SLACK");
  const [replyDrafts, setReplyDrafts] = useState<
    Record<string, { text: string; value: string }>
  >({});
  const [telemetryValue, setTelemetryValue] = useState<string>("");
  const [telemetryNote, setTelemetryNote] = useState<string>("");

  const goalEvidences = evidences.filter((ev) => ev.employeeId === employee.id);
  const employeeCheckIns = checkIns.filter(
    (chk) => chk.employeeId === employee.id,
  );
  const employeeAlerts = driftAlerts.filter(
    (al) => al.employeeId === employee.id,
  );

  useEffect(() => {
    if (!primaryGoal) return;
    const latestEv = goalEvidences.find((e) => e.goalId === primaryGoal.id);
    setTelemetryValue(
      String(
        latestEv
          ? latestEv.metricSnapshot
          : primaryGoal.kpiBinding.baselineValue,
      ),
    );
  }, [selectedEmployeeId, primaryGoal?.id]);

  if (!primaryGoal) {
    return null;
  }

  const handleTriggerPing = () => {
    triggerBotCheckIn(primaryGoal.id, selectedChannel);
  };

  const handleSubmitCheckIn = (checkInId: string, fallbackVal: number) => {
    const draft = replyDrafts[checkInId];
    const parsedNum = Number(draft?.value);
    const valueToSubmit = Number.isFinite(parsedNum) ? parsedNum : fallbackVal;
    const replyText =
      draft?.text?.trim() ||
      `อัปเดตความคืบหน้าล่าสุดที่ ${valueToSubmit} ${primaryGoal.kpiBinding.unit}`;
    submitEmployeeCheckIn(checkInId, replyText, valueToSubmit);
  };

  const handleIngestTelemetry = () => {
    const parsed = Number(telemetryValue);
    if (!Number.isFinite(parsed)) return;
    ingestSourceTelemetry(primaryGoal.id, parsed, telemetryNote || undefined);
    setTelemetryNote("");
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Top Bar: Cycle Month Controller & Privacy Indicator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Phase 2: In-Cycle Tracking &amp; Multi-Channel Evidence</span>
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            ติดตามผลระหว่าง Cycle, Bot Check-in และสัญญาณเตือนเป้าหมายหลุด
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <button
                key={month}
                type="button"
                onClick={() => setCycleMonth(month)}
                className={`px-2.5 py-1.5 rounded-lg font-mono font-semibold transition-all cursor-pointer ${
                  currentCycleMonth === month
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                M{month}
              </button>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {maskPii
                ? `Bot Redacted ID: ${employee.anonymizedId}`
                : `Unmasked Identity: ${employee.name}`}
            </span>
          </span>
        </div>
      </div>

      {/* Drift Alert Cards (HITL Manager Governance) */}
      <div className="grid grid-cols-1 gap-4">
        {employeeAlerts.map((alert) => {
          const isCritical = alert.severity === "CRITICAL_DRIFT";
          const isRisk = alert.severity === "AT_RISK";
          const badgeStyle = isCritical
            ? "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
            : isRisk
              ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
              : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
          const barColor = isCritical
            ? "bg-rose-500"
            : isRisk
              ? "bg-amber-500"
              : "bg-emerald-500";

          return (
            <div
              key={alert.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {isCritical || isRisk ? (
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        isCritical ? "text-rose-500" : "text-amber-500"
                      }`}
                    />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {primaryGoal.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {primaryGoal.kpiBinding.metricName} (Baseline:{" "}
                      {primaryGoal.kpiBinding.baselineValue}{" "}
                      {primaryGoal.kpiBinding.unit} -&gt; Target:{" "}
                      {primaryGoal.kpiBinding.targetValue}{" "}
                      {primaryGoal.kpiBinding.unit})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${badgeStyle}`}
                  >
                    {alert.severity}
                  </span>
                  {(isCritical || isRisk) && !alert.acknowledged && (
                    <button
                      type="button"
                      onClick={() => acknowledgeDriftAlert(alert.id)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>Acknowledge Drift (HITL)</span>
                    </button>
                  )}
                  {alert.acknowledged && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      Manager Acknowledged
                    </span>
                  )}
                </div>
              </div>

              {/* Progress vs Expected Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600 dark:text-slate-300">
                    Actual Progress: <strong>{alert.progressPct}%</strong>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Expected (Month {currentCycleMonth}/6):{" "}
                    <strong>{alert.expectedPct}%</strong>
                  </span>
                </div>
                <div className="relative h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${Math.min(100, alert.progressPct)}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900 dark:bg-white"
                    style={{ left: `${Math.min(100, alert.expectedPct)}%` }}
                    title={`Expected Milestone: ${alert.expectedPct}%`}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {alert.message}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Slack / LINE Bot Monthly Check-in Simulator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Monthly Bot Check-in Simulator
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {(["SLACK", "LINE"] as CheckInChannel[]).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                    selectedChannel === ch
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {ch}
                </button>
              ))}
              <button
                type="button"
                onClick={handleTriggerPing}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Send Bot Ping</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {employeeCheckIns.map((chk) => {
              const draft = replyDrafts[chk.id] || {
                text: chk.employeeReply || "",
                value: String(chk.reportedValue),
              };
              return (
                <div
                  key={chk.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {chk.channel} · {chk.monthLabel}
                    </span>
                    <span
                      className={`font-bold ${
                        chk.status === "SUBMITTED"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {chk.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    {chk.botPrompt}
                  </p>

                  {chk.status === "PENDING" ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={draft.text}
                        onChange={(e) =>
                          setReplyDrafts({
                            ...replyDrafts,
                            [chk.id]: { ...draft, text: e.target.value },
                          })
                        }
                        placeholder="พิมพ์คำตอบสั้นๆ ของพนักงาน..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.5"
                          value={draft.value}
                          onChange={(e) =>
                            setReplyDrafts({
                              ...replyDrafts,
                              [chk.id]: { ...draft, value: e.target.value },
                            })
                          }
                          aria-label="Reported metric value"
                          className="w-28 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                        />
                        <span className="text-xs text-slate-500">
                          {primaryGoal.kpiBinding.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleSubmitCheckIn(chk.id, chk.reportedValue)
                          }
                          className="ml-auto px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                        >
                          Submit Bot Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
                      <strong>Employee Reply:</strong> {chk.employeeReply} (
                      <span className="font-mono">
                        {chk.reportedValue} {primaryGoal.kpiBinding.unit}
                      </span>
                      )
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Automated Source Telemetry Sync & Evidence Ledger */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Telemetry Collector &amp; Evidence Ledger
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {primaryGoal.kpiBinding.dataSourceType}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>
                Ingest Metric From {primaryGoal.kpiBinding.dataSourceUri}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                step="0.5"
                value={telemetryValue}
                onChange={(e) => setTelemetryValue(e.target.value)}
                aria-label="Telemetry value"
                className="w-28 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
              />
              <input
                type="text"
                value={telemetryNote}
                onChange={(e) => setTelemetryNote(e.target.value)}
                placeholder="หมายเหตุหลักฐานเพิ่มเติม (ไม่บังคับ)..."
                className="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
              />
              <button
                type="button"
                onClick={handleIngestTelemetry}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                Sync Telemetry
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {goalEvidences.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    {ev.sourceType}
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {ev.metricSnapshot} {primaryGoal.kpiBinding.unit}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-200">
                  {ev.summary}
                </p>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  {ev.verifiedUri}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
