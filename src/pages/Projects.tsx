import { ArrowUpRight } from "lucide-react";

import { RichText } from "../components/RichText";
import { focusAreas, projectCategories, projectIntro } from "../data/projects";

export default function Projects() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted dark:text-night-muted">
        {projectIntro}
      </p>

      {projectCategories.map((category) => (
        <section key={category.title} className="mt-14">
          <h2 className="border-b-2 border-ink pb-2 text-xl font-semibold dark:border-white">
            {category.title}
          </h2>

          <div className="mt-6 space-y-5">
            {category.projects.map((project) => (
              <article
                key={project.name}
                className="rounded-2xl border border-black/10 p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:hover:border-white/20"
              >
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-lg font-semibold"
                >
                  {project.name}
                  <ArrowUpRight
                    size={16}
                    className="text-ink-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-night-muted"
                  />
                </a>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md bg-paper-alt px-2 py-1 font-mono text-[11px] text-ink-muted dark:bg-white/5 dark:text-night-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-[15px] leading-relaxed text-ink-muted dark:text-night-muted">
                  {project.summary}
                </p>

                <ul className="mt-4 space-y-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm leading-relaxed text-ink-muted dark:text-night-muted"
                    >
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
                      <span>
                        <RichText>{feature}</RichText>
                      </span>
                    </li>
                  ))}
                </ul>

                {project.note && (
                  <p className="mt-4 border-l-2 border-ink pl-3 text-sm italic text-ink-muted dark:border-white dark:text-night-muted">
                    <RichText>{project.note}</RichText>
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-14 rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <h2 className="text-sm font-semibold tracking-wide uppercase">Core focus areas</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {focusAreas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-black/15 px-3 py-1 text-sm text-ink-muted dark:border-white/20 dark:text-night-muted"
            >
              {area}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
