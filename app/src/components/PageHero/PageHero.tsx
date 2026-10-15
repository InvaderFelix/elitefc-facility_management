import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Accent word(s) rendered inside the <h1> in the highlight <span>. */
  accent?: string;
  description?: ReactNode;
  /** Optional content below the description (e.g. Home's stat row). */
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, accent, description, children }: PageHeroProps) {
  return (
    <section className="hero">
      <div className="eyebrow">{eyebrow}</div>

      <h1>
        {title}
        {accent && <span>{accent}</span>}
      </h1>

      {description && <p className="hero-description">{description}</p>}

      {children}
    </section>
  );
}
