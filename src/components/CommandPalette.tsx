import { useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Coffee as CoffeeIcon,
  ExternalLink,
  FileText,
  FolderGit2,
  Github,
  Linkedin,
  Mail,
  Music2,
  Search,
  User,
} from "lucide-react";

import { socials } from "../data/profile";

type Icon = ComponentType<{ size?: number; className?: string }>;

type Item = {
  label: string;
  hint: string;
  icon: Icon;
  run: (navigate: ReturnType<typeof useNavigate>) => void;
};

const pages: Item[] = [
  { label: "About", hint: "Page", icon: User, run: (navigate) => navigate("/") },
  { label: "Projects", hint: "Page", icon: FolderGit2, run: (navigate) => navigate("/projects") },
  { label: "CV", hint: "Page", icon: FileText, run: (navigate) => navigate("/cv") },
  { label: "Coffee", hint: "Page", icon: CoffeeIcon, run: (navigate) => navigate("/coffee") },
  { label: "Music", hint: "Page", icon: Music2, run: (navigate) => navigate("/music") },
];

const socialIcons: Record<string, Icon> = { mail: Mail, linkedin: Linkedin, github: Github };

const socialItems: Item[] = socials.map((social) => ({
  label: social.label,
  hint: "Link",
  icon: socialIcons[social.icon] ?? ExternalLink,
  run: () => window.open(social.href, social.href.startsWith("mailto:") ? undefined : "_blank"),
}));

const allItems = [...pages, ...socialItems];

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allItems.filter((item) => item.label.toLowerCase().includes(q)) : allItems;
  }, [query]);

  useEffect(() => setActive(0), [query, open]);

  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [open]);

  function run(item: Item) {
    item.run(navigate);
    onOpenChange(false);
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (items.length ? (a + 1) % items.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (items.length ? (a - 1 + items.length) % items.length : 0));
    } else if (e.key === "Enter" && items[active]) {
      e.preventDefault();
      run(items[active]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-start justify-center bg-black/40 px-4 pt-[15vh] backdrop-blur-sm dark:bg-black/60"
      onClick={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-paper shadow-2xl dark:border-white/10 dark:bg-night-alt"
      >
        <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3 dark:border-white/10">
          <Search size={16} className="shrink-0 text-ink-muted dark:text-night-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Jump to a page or link…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted dark:placeholder:text-night-muted"
          />
          <kbd className="hidden shrink-0 rounded border border-black/15 px-1.5 py-0.5 font-mono text-[10px] text-ink-muted sm:block dark:border-white/15 dark:text-night-muted">
            esc
          </kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto p-1.5">
          {items.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-ink-muted dark:text-night-muted">No matches.</li>
          ) : (
            items.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => run(item)}
                    className={[
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      i === active
                        ? "bg-ink text-paper dark:bg-white dark:text-black"
                        : "text-ink hover:bg-paper-alt dark:text-night-fg dark:hover:bg-white/5",
                    ].join(" ")}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    <span className={["font-mono text-[11px]", i === active ? "opacity-70" : "text-ink-muted dark:text-night-muted"].join(" ")}>
                      {item.hint}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
