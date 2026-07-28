"use client";

import { useState, useEffect, useMemo } from "react";
import { vars } from "./ui/theme";
import type { Theme, DayLog } from "./ui/theme";
import { getStatus } from "./ui/StatusBadge";
import SetupView from "./ui/SetupView";
import DashboardView from "./ui/DashboardView";

type Step = "setup" | "dashboard";

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  return Math.ceil((b.getTime() - a.getTime()) / msPerDay);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendanceTracker() {
  const [step, setStep] = useState<Step>("setup");
  const [theme, setTheme] = useState<Theme>("dark");

  const [classesPerDay, setClassesPerDay] = useState<number>(8);
  const [targetPercent, setTargetPercent] = useState<number>(75);
  const [attended, setAttended] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [endDate, setEndDate] = useState<string>("");
  const [todayInput, setTodayInput] = useState<number>(8);
  const [logs, setLogs] = useState<DayLog[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [attendedError, setAttendedError] = useState<string | null>(null);
  const [totalError, setTotalError] = useState<string | null>(null);

  const daysLeft = useMemo(() => {
    if (!endDate) return 0;
    const end = new Date(endDate + "T23:59:59");
    const now = new Date();
    return Math.max(0, daysBetween(now, end));
  }, [endDate]);

  useEffect(() => {
    const a = Number(localStorage.getItem("att_attended"));
    const t = Number(localStorage.getItem("att_total"));
    const e = localStorage.getItem("att_endDate") || "";
    const c = Number(localStorage.getItem("att_cpd")) || 8;
    const p = Number(localStorage.getItem("att_target")) || 75;
    const rawLogs = localStorage.getItem("att_logs");
    const parsedLogs: DayLog[] = rawLogs ? JSON.parse(rawLogs) : [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttended(a);
    setTotal(t);
    setEndDate(e);
    setClassesPerDay(c);
    setTargetPercent(p);
    setTodayInput(c);
    setLogs(parsedLogs);
    const savedTheme =
      (localStorage.getItem("att_theme") as Theme) || "dark";
    setTheme(savedTheme);
    setHydrated(true);
    if (t > 0 && e) setStep("dashboard");
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("att_theme", theme);
    localStorage.setItem("att_attended", String(attended));
    localStorage.setItem("att_total", String(total));
    localStorage.setItem("att_endDate", endDate);
    localStorage.setItem("att_cpd", String(classesPerDay));
    localStorage.setItem("att_target", String(targetPercent));
    localStorage.setItem("att_logs", JSON.stringify(logs));
  }, [
    attended,
    total,
    endDate,
    classesPerDay,
    targetPercent,
    theme,
    logs,
    hydrated,
  ]);

  const stats = useMemo(() => {
    const futureClasses = daysLeft * classesPerDay;
    const finalTotal = total + futureClasses;
    const requiredTotal = Math.ceil((targetPercent / 100) * finalTotal);
    const neededMore = requiredTotal - attended;
    const canMiss = futureClasses - neededMore;
    const requiredDaily = neededMore / (daysLeft || 1);
    const currentPercent = total > 0 ? (attended / total) * 100 : 0;

    const projectedPercent =
      finalTotal > 0
        ? ((attended + futureClasses) / finalTotal) * 100
        : currentPercent;

    return {
      futureClasses,
      finalTotal,
      requiredTotal,
      neededMore,
      canMiss,
      requiredDaily,
      currentPercent,
      projectedPercent,
    };
  }, [attended, total, daysLeft, classesPerDay, targetPercent]);

  const isValid =
    !attendedError && !totalError && total > 0 && endDate !== "";

  const handleTotal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? 0 : Number(e.target.value);
    setTotal(val);
    setTotalError(val < 0 ? "Total classes can't be negative" : null);
    if (attended > val && val > 0) {
      setAttendedError(`Can't attend more than ${val} classes held`);
    } else {
      setAttendedError(null);
    }
  };

  const handleAttended = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? 0 : Number(e.target.value);
    if (val < 0) {
      setAttendedError("Attended classes can't be negative");
    } else if (total > 0 && val > total) {
      setAttendedError(`Can't attend more than ${total} total classes held`);
    } else {
      setAttendedError(null);
      setAttended(val);
    }
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndDate(e.target.value);

  const handleClassesPerDay = (e: React.ChangeEvent<HTMLInputElement>) =>
    setClassesPerDay(e.target.value === "" ? 0 : Number(e.target.value));

  const handleTargetPercent = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTargetPercent(e.target.value === "" ? 0 : Number(e.target.value));

  const submitToday = () => {
    if (daysLeft <= 0) return;
    const a = Math.min(Math.max(Number(todayInput), 0), classesPerDay);
    const today = todayStr();
    const existing = logs.find((l) => l.date === today);
    if (existing) {
      setAttended((x) => x - existing.attended + a);
    } else {
      setAttended((x) => x + a);
      setTotal((x) => x + classesPerDay);
    }
    setLogs((prev) => {
      const idx = prev.findIndex((l) => l.date === today);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { date: today, attended: a, total: classesPerDay };
        return next;
      }
      return [...prev, { date: today, attended: a, total: classesPerDay }];
    });
    setTodayInput(classesPerDay);
  };

  const removeToday = () => {
    const today = todayStr();
    const existing = logs.find((l) => l.date === today);
    if (!existing) return;
    setAttended((x) => x - existing.attended);
    setTotal((x) => x - existing.total);
    setLogs((prev) => prev.filter((l) => l.date !== today));
  };

  const clearData = () => {
    localStorage.removeItem("att_attended");
    localStorage.removeItem("att_total");
    localStorage.removeItem("att_endDate");
    localStorage.removeItem("att_cpd");
    localStorage.removeItem("att_target");
    localStorage.removeItem("att_logs");
    setAttended(0);
    setTotal(0);
    setEndDate("");
    setClassesPerDay(8);
    setTargetPercent(75);
    setTodayInput(8);
    setLogs([]);
    setAttendedError(null);
    setTotalError(null);
    setStep("setup");
  };

  const toggleTheme = () =>
    setTheme((th) => (th === "dark" ? "light" : "dark"));

  const isDark = theme === "dark";
  const status = getStatus(stats.canMiss, classesPerDay, isDark);

  if (!hydrated) return null;

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-md px-5 py-8"
      style={{
        ...vars(theme),
        background: "var(--bg)",
        transition: "background 0.3s ease",
      }}
    >
      {step === "setup" ? (
        <SetupView
          theme={theme}
          onToggleTheme={toggleTheme}
          total={total}
          attended={attended}
          endDate={endDate}
          classesPerDay={classesPerDay}
          targetPercent={targetPercent}
          totalError={totalError}
          attendedError={attendedError}
          isValid={isValid}
          onTotalChange={handleTotal}
          onAttendedChange={handleAttended}
          onEndDateChange={handleEndDate}
          onClassesPerDayChange={handleClassesPerDay}
          onTargetPercentChange={handleTargetPercent}
          onSubmit={() => {
            setTodayInput(classesPerDay);
            setStep("dashboard");
          }}
        />
      ) : (
        <DashboardView
          theme={theme}
          onToggleTheme={toggleTheme}
          onClearData={clearData}
          stats={stats}
          status={status}
          targetPercent={targetPercent}
          daysLeft={daysLeft}
          classesPerDay={classesPerDay}
          attended={attended}
          total={total}
          endDate={endDate}
          todayInput={todayInput}
          onTodayInputChange={setTodayInput}
          onSubmitToday={submitToday}
          onRemoveToday={removeToday}
          logs={logs}
          onTargetPercentChange={(n) => {
            setTargetPercent(n);
            setTotalError(null);
          }}
          onClassesPerDayChange={(n) => {
            setClassesPerDay(n);
            setTodayInput(n);
          }}
          onEndDateChange={(v) => setEndDate(v)}
          onAttendedChange={(n) => {
            setAttended(n);
            if (total > 0 && n > total) {
              setAttendedError(`Can't be more than ${total}`);
            } else {
              setAttendedError(null);
            }
          }}
          onTotalChange={(n) => {
            setTotal(n);
            setTotalError(n < 0 ? "Can't be negative" : null);
            if (attended > n && n > 0) {
              setAttendedError(`Can't be more than ${n}`);
            } else {
              setAttendedError(null);
            }
          }}
        />
      )}
    </div>
  );
}
