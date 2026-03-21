
type Theme = "dark" | "light";

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

export default iStyle;