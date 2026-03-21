
import Field from "./Field";
import iStyle from "./iStyle";
type Theme = "dark" | "light";
function Setup({  theme, setTheme,attended, setAttended, inp, total, daysLeft, classesPerDay, targetPercent, setClassesPerDay, setTargetPercent, setDaysLeft, setTotal,setTodayInput, setStep }: any) {
  return (
    <div style={{  background: "var(--bg)", minHeight: "100vh", maxWidth: 420, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif", transition: "background 0.2s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
          <div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Bunk-Tendance
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 500, margin: "0.15rem 0 0", color: "var(--text)" }}>
              Let&apos;s set things up
            </h1>
          </div>
          <ThemeBtn theme={theme} onToggle={() => setTheme((t: Theme) => t === "dark" ? "light" : "dark")} />
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
  )
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

export default Setup