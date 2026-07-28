import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/cv", label: "CV" },
  { to: "/coffee", label: "Coffee" },
  { to: "/music", label: "Music" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "relative py-1 text-sm font-medium transition-colors",
    isActive
      ? "text-ink dark:text-white after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-current"
      : "text-ink-muted hover:text-ink dark:text-night-muted dark:hover:text-white",
  ].join(" ");

export function Header() {
  const [open, setOpen] = useState(false);

  // Lock scrolling while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[1100] border-b border-black/10 bg-paper/85 backdrop-blur-md dark:border-white/10 dark:bg-night/85">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5">
        <NavLink to="/" className="font-mono text-sm font-semibold tracking-tight">
          lucas<span className="text-ink-muted dark:text-night-muted">.pereira</span>
        </NavLink>

        <div className="flex items-center gap-1">
          <nav className="mr-2 hidden items-center gap-6 sm:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-full p-2 text-ink-muted transition hover:bg-black/5 hover:text-ink sm:hidden dark:text-night-muted dark:hover:bg-white/10 dark:hover:text-white"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-black/10 bg-paper px-5 py-3 sm:hidden dark:border-white/10 dark:bg-night">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  "block py-2.5 text-sm font-medium transition-colors",
                  isActive ? "text-ink dark:text-white" : "text-ink-muted dark:text-night-muted",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
