"use client";

import { useState, useMemo, useEffect } from "react";

export default function AttendanceTracker() {
  const [CLASSES_PER_DAY, setCLASSES_PER_DAY] = useState<number>(8);
  const [TARGET_PERCENT, setTARGET_PERCENT] = useState<number>(65);
  const [attended, setAttended] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [todayInput, setTodayInput] = useState<number>(0);

  
  useEffect(() => {
    setAttended(Number(localStorage.getItem("attended")) || 0);
    setTotal(Number(localStorage.getItem("total")) || 0);
    setDaysLeft(Number(localStorage.getItem("daysLeft")) || 0);
    setCLASSES_PER_DAY(Number(localStorage.getItem("classesPerDay")) || 8);
    setTARGET_PERCENT(Number(localStorage.getItem("targetPercent")) || 65);
  }, []);

  const stats = useMemo(() => {
    const futureClasses = daysLeft * CLASSES_PER_DAY;
    const finalTotal = total + futureClasses;
    const requiredTotal = Math.ceil((TARGET_PERCENT / 100) * finalTotal);

    const neededMore = requiredTotal - attended;
    const canMiss = futureClasses - neededMore;
    const requiredDaily = neededMore / (daysLeft || 1);

    // ✅ Fix #5: Guard against division by zero
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
  }, [attended, total, daysLeft, CLASSES_PER_DAY, TARGET_PERCENT]);

 
  useEffect(() => {
    localStorage.setItem("attended", String(attended));
    localStorage.setItem("total", String(total));
    localStorage.setItem("daysLeft", String(daysLeft));
    localStorage.setItem("classesPerDay", String(CLASSES_PER_DAY));
    localStorage.setItem("targetPercent", String(TARGET_PERCENT));
  }, [attended, total, daysLeft, CLASSES_PER_DAY, TARGET_PERCENT]);

  const submitToday = () => {
    if (daysLeft <= 0) return;

    const attendedToday = Math.min(
      Math.max(Number(todayInput), 0),
      CLASSES_PER_DAY
    );

    setAttended((a) => a + attendedToday);
    setTotal((t) => t + CLASSES_PER_DAY);
    setDaysLeft((d) => d - 1);
    setTodayInput(CLASSES_PER_DAY);
  };


  const handleNumberInput = (
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? 0 : Number(e.target.value);
    setter(val);
  };

  const status = useMemo(() => {
    if (stats.canMiss < 0) return "FAILED";
    if (stats.canMiss <= 8) return "DANGER";
    if (stats.canMiss <= 16) return "RISKY";
    return "SAFE";
  }, [stats.canMiss]);

  const statusColor: Record<string, string> = {
    SAFE: "text-green-400",
    RISKY: "text-yellow-400",
    DANGER: "text-orange-400",
    FAILED: "text-red-500",
  };

  return (
    <div className="p-6 mt-6 max-w-xl w-full mx-auto bg-neutral-900 text-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-black mb-4">Bunk-tendance</h2>

      {/* CURRENT ATTENDANCE */}
      <div className="text-sm space-y-1">
        <h1>Current attendance:</h1>
        <div className="flex gap-2 items-center">
          <input
            className="w-fit inline p-2 rounded-lg bg-neutral-800 border border-neutral-700"
            type="number"
            placeholder="Classes attended"
            value={attended}
            onChange={handleNumberInput(setAttended)}
          />
          <span>out of</span>
          <input
            className="w-fit inline p-2 rounded-lg bg-neutral-800 border border-neutral-700"
            type="number"
            placeholder="Total classes held"
            value={total}
            onChange={handleNumberInput(setTotal)}
          />
        </div>
      </div>

      <hr className="my-3 border-neutral-700" />


      <div className="text-sm space-y-1">
        <p>Days remaining in semester</p>
        <input
          type="number"
          value={daysLeft}
          onChange={handleNumberInput(setDaysLeft)}
          className="w-1/2 p-1 bg-neutral-800 rounded"
          placeholder="Days left"
          min={0}
        />
      </div>

      <hr className="my-3 border-neutral-700" />

      <div className="text-sm space-y-1">
        <p>Classes per day</p>
        <input
          value={CLASSES_PER_DAY}
          onChange={handleNumberInput(setCLASSES_PER_DAY)}
          className="w-1/2 p-1 bg-neutral-800 rounded"
          placeholder="Classes per day"
          type="number"
          min={1}
        />
      </div>

      <hr className="my-3 border-neutral-700" />

      <div className="text-sm space-y-1">
        <p>Target percentage</p>
        <input
          value={TARGET_PERCENT}
          onChange={handleNumberInput(setTARGET_PERCENT)}
          className="w-1/2 p-1 bg-neutral-800 rounded"
          placeholder="Target %"
          type="number"
          min={0}
          max={100}
        />
      </div>

      <hr className="my-3 border-neutral-700" />

      <div className="text-sm space-y-1">
        <p>Current: {stats.currentPercent.toFixed(1)}%</p>
        <p>Required Total: {stats.requiredTotal}</p>
        <p>Need More: {stats.neededMore}</p>
      </div>

      <hr className="my-3 border-neutral-700" />

      <div className="text-sm space-y-1">
        <p>
          Buffer (can miss):{" "}
          <span className="font-semibold">{stats.canMiss}</span>
        </p>
        <p>
          Daily Needed: {stats.requiredDaily.toFixed(2)} (~
          {Math.ceil(stats.requiredDaily)})
        </p>
        <p
          className={`font-bold w-fit bg-white/5 border rounded-2xl px-2 ${statusColor[status]}`}
        >
          Status: {status}
        </p>
      </div>

      <hr className="my-3 border-neutral-700" />

      <div className="mt-3">
        <label className="text-sm block mb-1">
          Classes attended today (0–{CLASSES_PER_DAY})
        </label>
        <input
          type="number"
          value={todayInput}
          min={0}
          max={CLASSES_PER_DAY}
          onChange={handleNumberInput(setTodayInput)}
          className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700"
        />
      </div>

      <button
        onClick={submitToday}
        disabled={daysLeft <= 0}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed p-2 rounded-xl"
      >
        {daysLeft <= 0 ? "No days remaining" : "Submit Day"}
      </button>
    </div>
  );
}