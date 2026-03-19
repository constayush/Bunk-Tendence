"use client";

import { useState, useMemo, useEffect } from "react";

export default function AttendanceTracker() {
  const [CLASSES_PER_DAY, setCLASSES_PER_DAY] = useState(8);
  const [TARGET_PERCENT, setTARGET_PERCENT] = useState(65);
const [attended, setAttended] = useState(0);
const [total, setTotal] = useState(0);
const [daysLeft, setDaysLeft] = useState(0);

useEffect(() => {
  setAttended(Number(localStorage.getItem("attended")) || 0);
  setTotal(Number(localStorage.getItem("total")) || 0);
  setDaysLeft(Number(localStorage.getItem("daysLeft")) || 0);
}, []);

  const [todayInput, setTodayInput] = useState(8);

  const futureClasses = daysLeft * CLASSES_PER_DAY;

  const stats = useMemo(() => {
    const finalTotal = total + futureClasses;
    const requiredTotal = Math.ceil((TARGET_PERCENT / 100) * finalTotal);

    const neededMore = requiredTotal - attended;
    const canMiss = futureClasses - neededMore;
    const requiredDaily = neededMore / (daysLeft || 1);

    const currentPercent = (attended / total) * 100;

    return {
      finalTotal,
      requiredTotal,
      neededMore,
      canMiss,
      requiredDaily,
      currentPercent,
    };
  }, [attended, total, daysLeft, CLASSES_PER_DAY, TARGET_PERCENT]);

  // 💾 persist
  useEffect(() => {
    localStorage.setItem("attended", String(attended));
    localStorage.setItem("total", String(total));
    localStorage.setItem("daysLeft", String(daysLeft));
  }, [attended, total, daysLeft]);

  const submitToday = () => {
    if (daysLeft <= 0) return;

    const attendedToday = Math.min(
      Math.max(Number(todayInput), 0),
      CLASSES_PER_DAY,
    );

    setAttended((a) => a + attendedToday);
    setTotal((t) => t + CLASSES_PER_DAY);
    setDaysLeft((d) => d - 1);
    setTodayInput(8);
  };

  // 🚨 Decision Engine
  const status = useMemo(() => {
    if (stats.canMiss < 0) return "FAILED";
    if (stats.canMiss <= 8) return "DANGER";
    if (stats.canMiss <= 16) return "RISKY";
    return "SAFE";
  }, [stats.canMiss]);

  const statusColor = {
    SAFE: "text-green-400",
    RISKY: "text-yellow-400",
    DANGER: "text-orange-400",
    FAILED: "text-red-500",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editAttended, setEditAttended] = useState(attended);
  const [editTotal, setEditTotal] = useState(total);

  const startEdit = () => {
    setEditAttended(attended);
    setEditTotal(total);
    setIsEditing(true);
  };
  const saveEdit = () => {
    if (editAttended > editTotal) {
      alert("Attended cannot be greater than total");
      return;
    }

    setAttended(editAttended);
    setTotal(editTotal);
    setIsEditing(false);
  };

  return (
    <div className="p-6 mt-12 max-w-xl w-full mx-auto bg-neutral-900 text-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-black mb-4">Bunk-tendance</h2>

      {/* CURRENT */}
      <div className="text-sm space-y-1">
        {!isEditing ? (
          <>
            <p>
              Current: {attended}/{total} ({stats.currentPercent.toFixed(2)}%)
            </p>

            <button onClick={startEdit} className="text-blue-400 text-xs mt-1">
              Edit
            </button>
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="number"
                value={editAttended}
                onChange={(e) => setEditAttended(Number(e.target.value))}
                className="w-1/2 p-1 bg-neutral-800 rounded"
                placeholder="Attended"
              />

              <input
                type="number"
                value={editTotal}
                onChange={(e) => setEditTotal(Number(e.target.value))}
                className="w-1/2 p-1 bg-neutral-800 rounded"
                placeholder="Total"
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={saveEdit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600   p-1 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 p-1 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      <hr className="my-3 border-neutral-700" />

      <div className="text-sm space-y-1">
        <p>Classes per day</p>
        <input
          value={CLASSES_PER_DAY}
          onChange={(e) => setCLASSES_PER_DAY(Number(e.target.value))}
          className="w-1/2 p-1 bg-neutral-800 rounded"
          placeholder="Classes per day"
        />
      </div>
      <hr className="my-3 border-neutral-700" />

      <div>
        <p className="text-sm">Target Percentage?</p>
        <input
          value={TARGET_PERCENT}
          onChange={(e) => setTARGET_PERCENT(Number(e.target.value))}
          className="w-1/2 p-1 bg-neutral-800 rounded"
          placeholder="Target"
        />
      </div>
      <hr className="my-3 border-neutral-700" />

      <div className="text-sm space-y-1">
        <p>Required Total: {stats.requiredTotal}</p>
        <p>Need More: {stats.neededMore}</p>
      </div>

      <hr className="my-3 border-neutral-700" />

      {/* INTELLIGENCE */}
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
          className={`font-bold border rounded-2xl p-1 ${statusColor[status]}`}
        >
          Status: {status}
        </p>
      </div>

      <hr className="my-3 border-neutral-700" />

      {/* INPUT */}
      <div className="mt-3">
        <label className="text-sm block mb-1">
          Classes attended today (0–8)
        </label>
        <input
          type="number"
          value={todayInput}
          min={0}
          max={8}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTodayInput(e.target.value as unknown as number)}
          className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700"
        />
      </div>

      <button
        onClick={submitToday}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 p-2 rounded-xl"
      >
        Submit Day
      </button>
    </div>
  );
}
