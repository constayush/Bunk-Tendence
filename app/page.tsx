"use client";

import { useState, useMemo, useEffect } from "react";

type Step = "setup" | "dashboard";
type Theme = "dark" | "light";

const DARK: React.CSSProperties = {
  "--bg":        "#111110",
  "--bg2":       "#1c1c1a",
  "--bg3":       "#2a2a27",
  "--border":    "rgba(255,255,255,0.08)",
  "--text":      "#f0ede8",
  "--text2":     "#888780",
  "--text3":     "#555552",
} as React.CSSProperties;

const LIGHT: React.CSSProperties = {
  "--bg":        "#ffffff",
  "--bg2":       "#f4f3ef",
  "--bg3":       "#eae9e4",
  "--border":    "rgba(0,0,0,0.1)",
  "--text":      "#1a1a18",
  "--text2":     "#666560",
  "--text3":     "#aaa9a4",
} as React.CSSProperties;

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
  }, [attended, total, daysLeft, classesPerDay, targetPercent, theme, hydrated]);

  const stats = useMemo(() => {
    const futureClasses = daysLeft * classesPerDay;
    const finalTotal = total + futureClasses;
    const requiredTotal = Math.ceil((targetPercent / 100) * finalTotal);
    const neededMore = requiredTotal - attended;
    const canMiss = futureClasses - neededMore;
    const requiredDaily = neededMore / (daysLeft || 1);
    const currentPercent = total > 0 ? (attended / total) * 100 : 0;
    return { futureClasses, finalTotal, requiredTotal, neededMore, canMiss, requiredDaily, currentPercent };
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
    setAttended(0); setTotal(0); setDaysLeft(0);
    setClassesPerDay(8); setTargetPercent(75); setTodayInput(8);
    setStep("setup");
  };

  const t = theme === "dark";
  const vars = t ? DARK : LIGHT;

  const status = (() => {
    if (stats.canMiss < 0)                       return { label: "At risk",     color: "#E24B4A", bg: t ? "#2a1515" : "#FCEBEB", text: t ? "#f09595" : "#A32D2D" };
    if (stats.canMiss <= classesPerDay)           return { label: "Danger zone", color: "#EF9F27", bg: t ? "#2a1f0a" : "#FAEEDA", text: t ? "#FAC775" : "#854F0B" };
    if (stats.canMiss <= classesPerDay * 2)       return { label: "Be careful",  color: "#BA7517", bg: t ? "#241a07" : "#FAEEDA", text: t ? "#EF9F27" : "#633806" };
    return                                               { label: "You're good", color: "#1D9E75", bg: t ? "#0a1f18" : "#E1F5EE", text: t ? "#5DCAA5" : "#0F6E56" };
  })();

  const ringPercent = Math.min(stats.currentPercent, 100);
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (ringPercent / 100) * circumference;

  const inp = (setter: (n: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value === "" ? 0 : Number(e.target.value));

  if (!hydrated) return null;

  if (step === "setup") {
    return (
      <div style={{ ...vars, background: "var(--bg)", minHeight: "100vh", maxWidth: 420, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif", transition: "background 0.2s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
          <div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Attendance tracker
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 500, margin: "0.15rem 0 0", color: "var(--text)" }}>
              Let's set things up
            </h1>
          </div>
          <ThemeBtn theme={theme} onToggle={() => setTheme(t => t === "dark" ? "light" : "dark")} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <Field label="Classes attended so far" hint="e.g. 45" theme={theme}>
            <input type="number" min={0} value={attended || ""} onChange={inp(setAttended)}
              placeholder="0" style={iStyle(theme)} />
          </Field>

          <Field label="Total classes held so far" hint="e.g. 80" theme={theme}>
            <input type="number" min={0} value={total || ""} onChange={inp(setTotal)}
              placeholder="0" style={iStyle(theme)} />
          </Field>

          <Field label="Days left in semester" hint="school days remaining" theme={theme}>
            <input type="number" min={0} value={daysLeft || ""} onChange={inp(setDaysLeft)}
              placeholder="0" style={iStyle(theme)} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Classes per day" hint="usually 6–8" theme={theme}>
              <input type="number" min={1} max={20} value={classesPerDay || ""} onChange={inp(setClassesPerDay)}
                placeholder="8" style={iStyle(theme)} />
            </Field>
            <Field label="Target %" hint="min to pass" theme={theme}>
              <input type="number" min={1} max={100} value={targetPercent || ""} onChange={inp(setTargetPercent)}
                placeholder="75" style={iStyle(theme)} />
            </Field>
          </div>
        </div>

        <button
          onClick={() => { setTodayInput(classesPerDay); setStep("dashboard"); }}
          disabled={total === 0 || daysLeft === 0}
          style={{
            marginTop: "2rem", width: "100%", padding: "12px",
            background: total > 0 && daysLeft > 0 ? "var(--text)" : "var(--bg3)",
            color: total > 0 && daysLeft > 0 ? "var(--bg)" : "var(--text3)",
            border: "none", borderRadius: "12px",
            fontSize: 15, fontWeight: 500, cursor: total > 0 && daysLeft > 0 ? "pointer" : "not-allowed",
            transition: "opacity 0.15s"
          }}
        >
          See my dashboard →
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...vars, background: "var(--bg)", minHeight: "100vh", maxWidth: 420, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "system-ui, sans-serif", transition: "background 0.2s" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--text2)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Attendance
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ThemeBtn theme={theme} onToggle={() => setTheme(t => t === "dark" ? "light" : "dark")} />
          <button onClick={reset} style={{ background: "none", border: "none", fontSize: 12, color: "var(--text3)", cursor: "pointer", padding: "4px 8px" }}>
            Reset
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <svg width={120} height={120} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle cx="60" cy="60" r="52" fill="none"
            stroke={status.color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="500" fill="var(--text)">{stats.currentPercent.toFixed(0)}%</text>
          <text x="60" y="72" textAnchor="middle" fontSize="11" fill="var(--text2)">current</text>
        </svg>

        <div style={{ flex: 1 }}>
          <div style={{
            display: "inline-block", padding: "4px 10px", borderRadius: "8px",
            background: status.bg, color: status.text, fontSize: 13, fontWeight: 500, marginBottom: 12
          }}>
            {status.label}
          </div>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--text2)" }}>
            Target: <strong style={{ color: "var(--text)", fontWeight: 500 }}>{targetPercent}%</strong>
          </p>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--text2)" }}>
            Can bunk: <strong style={{ color: "var(--text)", fontWeight: 500 }}>{Math.max(stats.canMiss, 0)} classes</strong>
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text2)" }}>
            Days left: <strong style={{ color: "var(--text)", fontWeight: 500 }}>{daysLeft}</strong>
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "1.5rem" }}>
        {[
          { label: "Attended", value: attended },
          { label: "Total held", value: total },
          { label: "Need more", value: Math.max(stats.neededMore, 0) },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "var(--bg2)", borderRadius: "8px", padding: "10px 12px" }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "var(--text2)", fontWeight: 500 }}>{label}</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color: "var(--text)" }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ border: `0.5px solid var(--border)`, borderRadius: "12px", padding: "1rem 1.25rem", background: "var(--bg2)" }}>
        <p style={{ margin: "0 0 0.75rem", fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
          Log today
        </p>
        <p style={{ margin: "0 0 0.5rem", fontSize: 13, color: "var(--text2)" }}>
          How many classes did you attend?
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="number" min={0} max={classesPerDay} value={todayInput}
            onChange={inp(setTodayInput)}
            style={{ ...iStyle(theme), flex: 1 }} />
          <span style={{ fontSize: 13, color: "var(--text2)", whiteSpace: "nowrap" }}>
            of {classesPerDay}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6, margin: "0.75rem 0" }}>
          {[0, Math.floor(classesPerDay / 2), classesPerDay].map((v) => (
            <button key={v} onClick={() => setTodayInput(v)} style={{
              flex: 1, padding: "6px 0", fontSize: 13,
              background: todayInput === v ? "var(--text)" : "var(--bg3)",
              color: todayInput === v ? "var(--bg)" : "var(--text2)",
              border: `0.5px solid var(--border)`, borderRadius: "8px",
              cursor: "pointer", transition: "all 0.15s"
            }}>
              {v === 0 ? "Bunked" : v === classesPerDay ? "Full day" : "Half day"}
            </button>
          ))}
        </div>

        <button
          onClick={submitToday}
          disabled={daysLeft <= 0}
          style={{
            width: "100%", padding: "10px", marginTop: 4,
            background: daysLeft > 0 ? "var(--text)" : "var(--bg3)",
            color: daysLeft > 0 ? "var(--bg)" : "var(--text3)",
            border: "none", borderRadius: "8px",
            fontSize: 14, fontWeight: 500,
            cursor: daysLeft > 0 ? "pointer" : "not-allowed",
            transition: "all 0.15s"
          }}
        >
          {daysLeft > 0 ? "Submit day" : "Semester over"}
        </button>
      </div>

      <button onClick={() => setStep("setup")} style={{
        marginTop: "1rem", background: "none", border: "none",
        fontSize: 13, color: "var(--text3)", cursor: "pointer", padding: "4px 0"
      }}>
        ← Edit settings
      </button>
    </div>
  );
}

function ThemeBtn({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{
      width: 36, height: 20, borderRadius: 10, padding: 0, border: "none",
      background: theme === "dark" ? "#444441" : "#d3d1c7",
      cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0
    }}>
      <span style={{
        position: "absolute", top: 2, left: theme === "dark" ? 18 : 2,
        width: 16, height: 16, borderRadius: "50%",
        background: theme === "dark" ? "#f0ede8" : "#ffffff",
        transition: "left 0.2s", display: "block"
      }} />
    </button>
  );
}

function Field({ label, hint, theme, children }: { label: string; hint?: string; theme: Theme; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: "var(--text2)", marginLeft: 6, fontSize: 13 }}>— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function iStyle(theme: Theme): React.CSSProperties {
  return {
    width: "100%", padding: "10px 12px", boxSizing: "border-box",
    background: theme === "dark" ? "#1c1c1a" : "#f4f3ef",
    border: `0.5px solid ${theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
    borderRadius: "8px",
    fontSize: 15, color: theme === "dark" ? "#f0ede8" : "#1a1a18",
    outline: "none",
  };
}