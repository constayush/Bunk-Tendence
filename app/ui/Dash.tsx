import ThemeBtn from './ThemeBtn'
type Theme = "dark" | "light";
import iStyle from './iStyle';
function Dash({ inp,theme,setTheme, classesPerDay, targetPercent ,status, circumference, dashOffset,stats,submitToday,todayInput, setTodayInput, setStep, attended, total, daysLeft, reset }: any) {
    
  return (
<div style={{  background: "var(--bg)", minHeight: "100vh", maxWidth: 420, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "system-ui, sans-serif", transition: "background 0.2s" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "var(--text2)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Attendance
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ThemeBtn theme={theme} onToggle={() => setTheme((t : Theme)=> t === "dark" ? "light" : "dark")} />
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
  )
}

export default Dash