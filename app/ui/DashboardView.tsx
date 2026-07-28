"use client";

import { useState } from "react";
import type { Theme } from "./theme";
import type { StatusLevel } from "./StatusBadge";
import {
  ChartBar,
  GearSix,
  MagicWand,
  Check,
  Books,
  ArrowRight,
  Trash,
  FloppyDisk,
} from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import ThemeToggle from "./ThemeToggle";
import DonutChart from "./DonutChart";
import StatusBadge from "./StatusBadge";
import StatCard from "./StatCard";
import Card from "./Card";
import Field from "./Field";
import NumberInput from "./NumberInput";
import Projection from "./Projection";
import { MinusIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";

type Tab = "overview" | "settings" | "project";

export default function DashboardView({
  theme,
  onToggleTheme,
  onClearData,
  stats,
  status,
  targetPercent,
  daysLeft,
  classesPerDay,
  attended,
  total,
  endDate,
  todayInput,
  onTodayInputChange,
  onSubmitToday,
  onRemoveToday,
  logs,
  onTargetPercentChange,
  onClassesPerDayChange,
  onEndDateChange,
  onAttendedChange,
  onTotalChange,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  onClearData: () => void;
  stats: {
    currentPercent: number;
    canMiss: number;
    neededMore: number;
    projectedPercent: number;
  };
  status: StatusLevel;
  targetPercent: number;
  daysLeft: number;
  classesPerDay: number;
  attended: number;
  total: number;
  endDate: string;
  todayInput: number;
  onTodayInputChange: (n: number) => void;
  onSubmitToday: () => void;
  onRemoveToday: () => void;
  logs: { date: string; attended: number; total: number }[];
  onTargetPercentChange: (n: number) => void;
  onClassesPerDayChange: (n: number) => void;
  onEndDateChange: (v: string) => void;
  onAttendedChange: (n: number) => void;
  onTotalChange: (n: number) => void;
}) {
  const isDark = theme === "dark";
  const semesterDone = daysLeft <= 0;
  const [tab, setTab] = useState<Tab>("overview");

  const quickOptions = [
    { label: "Bunked", value: 0 },
    { label: "Half day", value: Math.floor(classesPerDay / 2) },
    { label: "Full day", value: classesPerDay },
  ];

  const tabs: { key: Tab; label: string; Icon: React.ComponentType<IconProps> }[] = [
    { key: "settings", label: "Settings", Icon: GearSix },
    { key: "overview", label: "Overview", Icon: ChartBar },
    { key: "project", label: "Project", Icon: MagicWand },
  ];

  const today = new Date().toISOString().slice(0, 10);
  const hasTodayLog = logs.some((l) => l.date === today);

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <span className="brand-badge">Bunk-Tendance</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm("Clear all attendance data? This cannot be undone.")) {
                onClearData();
              }
            }}
            className="danger-btn text-[13px]"
          >
            <Trash size={14} weight="bold" />
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>

      {/* Tab bar */}
      <div className="mb-5 flex gap-1 rounded-xl p-1" style={{ background: "var(--bg3)" }}>
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-medium transition-all duration-200"
            style={{
              background: tab === key ? "var(--bg)" : "transparent",
              color: tab === key ? "var(--text)" : "var(--text3)",
              boxShadow: tab === key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              border: tab === key ? "1px solid var(--border)" : "1px solid transparent",
            }}
          >
            <Icon size={14} weight={tab === key ? "fill" : "regular"} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="page-enter">
          {/* Hero section: chart + status */}
          <Card className="mb-4 p-5">
            <div className="flex items-center gap-5">
              <DonutChart
                percent={stats.currentPercent}
                color={status.color}
                size={140}
              />
              <div className="min-w-0 flex-1">
                <StatusBadge status={status} className="mb-3" />
                <div className="space-y-1.5">
                  <InfoRow label="Target" value={`${targetPercent}%`} />
                  <InfoRow
                    label="Can bunk"
                    value={`${Math.max(stats.canMiss, 0)} classes`}
                  />
                  <InfoRow label="Days left" value={String(daysLeft)} />
                </div>
              </div>
            </div>
          </Card>

          {/* Projected % banner */}
          <div
            className="mb-4 flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              background: stats.projectedPercent >= targetPercent
                ? isDark ? "#0a1f18" : "#E1F5EE"
                : isDark ? "#2a1515" : "#FCEBEB",
              border: `1px solid ${stats.projectedPercent >= targetPercent
                ? isDark ? "#1D9E7533" : "#1D9E7533"
                : isDark ? "#E24B4A33" : "#E24B4A33"}`,
            }}
          >
            <div>
              <p className="text-[11px]" style={{ color: "var(--text2)" }}>
                Projected final attendance
              </p>
              <p
                className="text-[20px] font-bold tabular-nums"
                style={{
                  color: stats.projectedPercent >= targetPercent
                    ? isDark ? "#5DCAA5" : "#0F6E56"
                    : isDark ? "#f09595" : "#A32D2D",
                }}
              >
                {stats.projectedPercent.toFixed(1)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px]" style={{ color: "var(--text3)" }}>
                {stats.projectedPercent >= targetPercent ? "On track" : "Below target"}
              </p>
              <p className="text-[11px]" style={{ color: "var(--text2)" }}>
                at current pace
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <StatCard label="Attended" value={attended} icon={<Check size={12} weight="bold" />} />
            <StatCard label="Total held" value={total} icon={<Books size={12} weight="bold" />} />
            <StatCard
              label="Need more"
              value={Math.max(stats.neededMore, 0)}
              icon={<ArrowRight size={12} weight="bold" />}
              accent={
                stats.neededMore > 0
                  ? isDark ? "#f09595" : "#c0392b"
                  : isDark ? "#5DCAA5" : "#0F6E56"
              }
            />
          </div>

          {/* Can bunk summary */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <Card className="flex flex-col items-center p-4 text-center">
              <p className="mb-1 text-[11px]" style={{ color: "var(--text2)" }}>
                Can bunk days
              </p>
              <p
                className="text-[22px] font-bold tabular-nums"
                style={{ color: "var(--text)" }}
              >
                {Math.floor(Math.max(stats.canMiss, 0) / classesPerDay)}
              </p>
            </Card>
            <Card className="flex flex-col items-center p-4 text-center">
              <p className="mb-1 text-[11px]" style={{ color: "var(--text2)" }}>
                Can bunk classes
              </p>
              <p
                className="text-[22px] font-bold tabular-nums"
                style={{ color: "var(--text)" }}
              >
                {Math.max(stats.canMiss, 0)}
              </p>
            </Card>
          </div>

          {/* Log today */}
          <Card className="p-5">
            <h3
              className="mb-1 text-[14px] font-medium"
              style={{ color: "var(--text)" }}
            >
              Log today
            </h3>
            <p className="mb-3 text-[13px]" style={{ color: "var(--text2)" }}>
              {semesterDone
                ? "Semester is over!"
                : "How many classes did you attend?"}
            </p>

            {!semesterDone && (
              <>
                <div className="mb-3 flex items-center gap-2">
                  <NumberInput
                    value={todayInput}
                    onChange={(e) =>
                      onTodayInputChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                    min={0}
                    max={classesPerDay}
                    theme={theme}
                    className="flex-1"
                  />
                  <span
                    className="whitespace-nowrap text-[13px]"
                    style={{ color: "var(--text2)" }}
                  >
                    of {classesPerDay}
                  </span>
                </div>

                <div className="mb-4 flex gap-2">
                  {quickOptions.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => onTodayInputChange(value)}
                      className={`quick-btn flex-1 ${todayInput === value ? "active" : ""}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-2">
              <button
                onClick={onRemoveToday}
                disabled={semesterDone || !hasTodayLog}
                className="danger-btn flex-1 gap-1 text-[13px] text-center flex justify-center items-center"
                style={{
                  opacity: semesterDone || !hasTodayLog ? 0.5 : 1,
                  cursor: semesterDone || !hasTodayLog ? "not-allowed" : "pointer",
                }}
              >
               <TrashIcon /> {" " }  Remove day 
              </button>
              <button
                onClick={onSubmitToday}
                disabled={semesterDone}
                className="primary-btn flex-1 gap-1"
                style={{
                  opacity: semesterDone ? 0.5 : 1,
                  cursor: semesterDone ? "not-allowed" : "pointer",
                }}
              >
               <PlusIcon /> {" " }  {semesterDone ? "Semester over" : "Submit day"}
              </button>
            
            </div>
          </Card>
        </div>
      )}

      {tab === "settings" && (
        <div className="page-enter">
          <Card className="mb-4 p-5">
            <h3
              className="mb-1 text-[14px] font-medium"
              style={{ color: "var(--text)" }}
            >
              Settings
            </h3>
            <p
              className="mb-4 text-[12px]"
              style={{ color: "var(--text2)" }}
            >
              Adjust your semester details
            </p>

            <div className="flex flex-col gap-4">
              <Field label="Total classes held" hint="" theme={theme}>
                <NumberInput
                  value={total}
                  onChange={(e) =>
                    onTotalChange(
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                  min={0}
                  theme={theme}
                />
              </Field>

              <Field label="Classes attended" hint="" theme={theme}>
                <NumberInput
                  value={attended}
                  onChange={(e) =>
                    onAttendedChange(
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                  min={0}
                  theme={theme}
                />
              </Field>

              <Field label="Semester end date" hint="" theme={theme}>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="number-input w-full rounded-[10px] px-3 py-2.5 text-[15px] outline-none transition-all duration-200"
                  style={{
                    background: "var(--bg3)",
                    color: "var(--text)",
                    border: "1.5px solid var(--border)",
                    colorScheme: theme === "dark" ? "dark" : "light",
                  }}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Classes per day" hint="" theme={theme}>
                  <NumberInput
                    value={classesPerDay}
                    onChange={(e) =>
                      onClassesPerDayChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                    min={1}
                    max={20}
                    theme={theme}
                  />
                </Field>
                <Field label="Target %" hint="your goal" theme={theme}>
                  <NumberInput
                    value={targetPercent}
                    onChange={(e) =>
                      onTargetPercentChange(
                        e.target.value === "" ? 0 : Number(e.target.value)
                      )
                    }
                    min={1}
                    max={100}
                    theme={theme}
                  />
                </Field>
              </div>
            </div>
          </Card>

          <button
            onClick={() => setTab("overview")}
            className="primary-btn w-full"
          >
            <FloppyDisk size={16} weight="bold" className="mr-1" />
            Done
          </button>
        </div>
      )}

      {tab === "project" && (
        <Card className="p-4 page-enter">
          <h3
            className="mb-1 text-[14px] font-medium"
            style={{ color: "var(--text)" }}
          >
            Attendance Projection
          </h3>
          <p
            className="mb-3 text-[12px]"
            style={{ color: "var(--text2)" }}
          >
            See what your attendance will look like after X days
          </p>
          <Projection
            attended={attended}
            total={total}
            classesPerDay={classesPerDay}
            targetPercent={targetPercent}
            theme={theme}
          />
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[13px]" style={{ color: "var(--text2)" }}>
      {label}:{" "}
      <strong className="font-medium" style={{ color: "var(--text)" }}>
        {value}
      </strong>
    </p>
  );
}
