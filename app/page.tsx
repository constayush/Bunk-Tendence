"use client";

import { useState, useMemo, useEffect } from "react";
import Setup from "./ui/Setup";
import Dash from "./ui/Dash";

type Step = "setup" | "dashboard";
type Theme = "dark" | "light";


export default function AttendanceTracker() {
  const [step, setStep] = useState<Step>("setup");
  const [theme, setTheme] = useState<Theme>("dark");

  const [classesPerDay, setClassesPerDay] = useState<number>(8);
  const [targetPercent, setTargetPercent] = useState<number>(75);
  const [attended, setAttended] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [todayInput, setTodayInput] = useState<number>(8);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const a = Number(localStorage.getItem("att_attended"));
    const t = Number(localStorage.getItem("att_total"));
    const d = Number(localStorage.getItem("att_daysLeft"));
    const c = Number(localStorage.getItem("att_cpd")) || 8;
    const p = Number(localStorage.getItem("att_target")) || 75;

    setAttended(a);
    setTotal(t);
    setDaysLeft(d);
    setClassesPerDay(c);
    setTargetPercent(p);
    setTodayInput(c);
    const savedTheme = (localStorage.getItem("att_theme") as Theme) || "dark";
    setTheme(savedTheme);
    setHydrated(true);

    if (t > 0 && d > 0) setStep("dashboard");
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("att_theme", theme);
    localStorage.setItem("att_attended", String(attended));
    localStorage.setItem("att_total", String(total));
    localStorage.setItem("att_daysLeft", String(daysLeft));
    localStorage.setItem("att_cpd", String(classesPerDay));
    localStorage.setItem("att_target", String(targetPercent));
  }, [
    attended,
    total,
    daysLeft,
    classesPerDay,
    targetPercent,
    theme,
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
    return {
      futureClasses,
      finalTotal,
      requiredTotal,
      neededMore,
      canMiss,
      requiredDaily,
      currentPercent,
    };
  }, [attended, total, daysLeft, classesPerDay, targetPercent]);

  const submitToday = () => {
    if (daysLeft <= 0) return;
    const a = Math.min(Math.max(Number(todayInput), 0), classesPerDay);
    setAttended((x) => x + a);
    setTotal((x) => x + classesPerDay);
    setDaysLeft((x) => x - 1);
    setTodayInput(classesPerDay);
  };

  const reset = () => {
    setAttended(0);
    setTotal(0);
    setDaysLeft(0);
    setClassesPerDay(8);
    setTargetPercent(75);
    setTodayInput(8);
    setStep("setup");
  };

  const t = theme === "dark";


  const status = (() => {
    if (stats.canMiss < 0)
      return {
        label: "At risk",
        color: "#E24B4A",
        bg: t ? "#2a1515" : "#FCEBEB",
        text: t ? "#f09595" : "#A32D2D",
      };
    if (stats.canMiss <= classesPerDay)
      return {
        label: "Danger zone",
        color: "#EF9F27",
        bg: t ? "#2a1f0a" : "#FAEEDA",
        text: t ? "#FAC775" : "#854F0B",
      };
    if (stats.canMiss <= classesPerDay * 2)
      return {
        label: "Be careful",
        color: "#BA7517",
        bg: t ? "#241a07" : "#FAEEDA",
        text: t ? "#EF9F27" : "#633806",
      };
    return {
      label: "You're good",
      color: "#1D9E75",
      bg: t ? "#0a1f18" : "#E1F5EE",
      text: t ? "#5DCAA5" : "#0F6E56",
    };
  })();

  const ringPercent = Math.min(stats.currentPercent, 100);
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (ringPercent / 100) * circumference;

  const inp =
    (setter: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value === "" ? 0 : Number(e.target.value));

  if (!hydrated) return null;

  if (step === "setup") {
    return (
      <Setup

        inp={inp}
        setTotal={setTotal}
        setAttended={setAttended}
        setDaysLeft={setDaysLeft}
        setClassesPerDay={setClassesPerDay}
        setTargetPercent={setTargetPercent}
        status={status}
        stats={stats}
        reset={reset}
        todayInput={todayInput}
        setTodayInput={setTodayInput}
        setStep={setStep}
        attended={attended}
        total={total}
        daysLeft={daysLeft}
        classesPerDay={classesPerDay}
        targetPercent={targetPercent}
      />
    );
  }

  return (
    <Dash

      status={status}
      stats={stats}
      circumference={circumference}
      dashOffset={dashOffset}
      submitToday={submitToday}
      inp={inp}
      todayInput={todayInput}
    />
  );
}
