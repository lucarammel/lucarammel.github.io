import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const isDark = () => document.documentElement.classList.contains("dark");

export function ThemeToggle() {
  // Seeded from the class the inline script in index.html already applied.
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full p-2 text-ink-muted transition hover:bg-black/5 hover:text-ink dark:text-night-muted dark:hover:bg-white/10 dark:hover:text-white"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
