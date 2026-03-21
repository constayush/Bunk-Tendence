type Theme = "dark" | "light";

function Field({ label, hint, children }: { label: string; hint?: string; theme: Theme; children: React.ReactNode }) {
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

export default Field;