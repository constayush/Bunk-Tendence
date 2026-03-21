type Theme = "dark" | "light";

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

export default ThemeBtn