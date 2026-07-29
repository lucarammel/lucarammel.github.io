import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

import { RichText } from "../components/RichText";
import { profile, socials, tools } from "../data/profile";

export default function Home() {
  const { currentRole } = profile;
  const email = socials.find((s) => s.icon === "mail")!.href;

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <section className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
        <img
          src={profile.photo}
          alt="Lucas Pereira — Data Scientist and Energy Modeling Engineer"
          width={640}
          height={640}
          className="h-40 w-40 shrink-0 rounded-full border-2 border-black/10 object-cover shadow-lg transition duration-300 hover:scale-[1.03] sm:h-48 sm:w-48 dark:border-white/15"
        />

        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Hi, I'm {profile.name}
          </h1>
          <p className="mt-2 font-mono text-sm text-ink-muted dark:text-night-muted">
            {profile.role}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-ink-muted sm:justify-start dark:text-night-muted">
            <MapPin size={14} />
            {profile.location}
          </p>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-muted dark:text-night-muted">
            {profile.tagline}
          </p>
        </div>
      </section>

      <section className="mt-14">
        <ul className="space-y-3">
          {profile.highlights.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[15px] leading-relaxed text-ink-muted transition-transform duration-150 hover:translate-x-1 dark:text-night-muted"
            >
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
              <span>
                <RichText>{item}</RichText>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[15px] leading-relaxed text-ink-muted dark:text-night-muted">
          Currently at{" "}
          <a
            href={currentRole.href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline decoration-black/25 underline-offset-4 transition hover:decoration-current dark:text-white dark:decoration-white/30"
          >
            {currentRole.company}
          </a>
          . Previously{" "}
          {currentRole.previously.map((org, i) => (
            <span key={org.name}>
              <a
                href={org.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-ink underline decoration-black/25 underline-offset-4 transition hover:decoration-current dark:text-white dark:decoration-white/30"
              >
                {org.name}
              </a>
              {i < currentRole.previously.length - 1 ? " and " : "."}
            </span>
          ))}
        </p>
      </section>

      <section className="mt-16">
        <h2 className="border-b-2 border-ink pb-2 text-xl font-semibold dark:border-white">
          What I use
        </h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {tools.map((tool) => (
            <li key={tool.name}>
              <a
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                title={tool.name}
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-paper-alt p-2.5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
              >
                <img src={tool.logo} alt={tool.name} loading="lazy" className="h-full w-full object-contain" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <h2 className="text-lg font-semibold">Let's talk</h2>
        <p className="mt-2 text-[15px] text-ink-muted dark:text-night-muted">
          Always happy to discuss energy modelling, data tooling — or coffee.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={email}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-black"
          >
            Get in touch <ArrowRight size={15} />
          </a>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-black/15 px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/20"
          >
            See my projects
          </Link>
        </div>
      </section>
    </div>
  );
}
