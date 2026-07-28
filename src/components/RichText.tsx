import { Fragment, type ReactNode } from "react";

/**
 * Renders the inline `**bold**` markers used across the content data files.
 * Deliberately not a full markdown parser — the content is ours and only ever
 * needs emphasis, so this avoids shipping a parser to every visitor.
 */
export function RichText({ children }: { children: string }): ReactNode {
  return children.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink dark:text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
