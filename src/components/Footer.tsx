import { Github, Linkedin, Mail } from "lucide-react";

import { socials } from "../data/profile";

const icons = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  // Malt has no lucide glyph; the wordmark initial keeps the row monochrome.
  malt: null,
} as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 py-8 sm:flex-row sm:justify-between">
        <p className="text-xs text-ink-muted dark:text-night-muted">
          © {new Date().getFullYear()} Lucas Pereira
        </p>

        <div className="flex items-center gap-1">
          {socials.map((social) => {
            const Icon = icons[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
                className="rounded-full p-2 text-ink-muted transition hover:bg-black/5 hover:text-ink dark:text-night-muted dark:hover:bg-white/10 dark:hover:text-white"
              >
                {Icon ? (
                  <Icon size={18} />
                ) : (
                  <span className="block h-[18px] w-[18px] text-center font-mono text-[13px] leading-[18px] font-semibold">
                    M
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
