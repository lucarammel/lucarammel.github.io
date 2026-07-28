import { RichText } from "../components/RichText";
import { education, experience, skills, type Entry } from "../data/cv";

function TimelineEntry({ entry }: { entry: Entry }) {
  return (
    <li className="relative border-l border-black/15 pb-8 pl-6 last:pb-0 dark:border-white/15">
      <span
        aria-hidden
        className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-ink dark:bg-white"
      />

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-base font-semibold">{entry.organisation}</h3>
        <span className="font-mono text-xs text-ink-muted dark:text-night-muted">{entry.period}</span>
      </div>

      <p className="mt-0.5 text-sm text-ink-muted dark:text-night-muted">
        {entry.title} · <span className="italic">{entry.location}</span>
      </p>

      <ul className="mt-3 space-y-2">
        {entry.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-ink-muted dark:text-night-muted">
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
            <span>
              <RichText>{bullet}</RichText>
            </span>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function CV() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">CV</h1>

      <section className="mt-12">
        <h2 className="border-b-2 border-ink pb-2 text-xl font-semibold dark:border-white">
          Experience
        </h2>
        <ul className="mt-8">
          {experience.map((entry) => (
            <TimelineEntry key={entry.organisation + entry.period} entry={entry} />
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="border-b-2 border-ink pb-2 text-xl font-semibold dark:border-white">
          Education
        </h2>
        <ul className="mt-8">
          {education.map((entry) => (
            <TimelineEntry key={entry.organisation + entry.period} entry={entry} />
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="border-b-2 border-ink pb-2 text-xl font-semibold dark:border-white">
          Skills
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {skills.map((group) => (
            <div key={group.title} className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
              <h3 className="text-sm font-semibold tracking-wide uppercase">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-ink-muted dark:text-night-muted">
                    <RichText>{item}</RichText>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
