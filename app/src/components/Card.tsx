import { type HTMLAttributes, type ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /* Small label above the title, e.g. a section category */
  eyebrow?: string;
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
}

/*
 * Generic content container for page sections, cards in a grid and portal
 * panels. Header renders only if eyebrow or title is given.
 */
export function Card({ eyebrow, title, footer, children, className = '', ...rest }: CardProps) {
  const hasHeader = Boolean(eyebrow || title);

  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {hasHeader && (
        <div className="card__header">
          {eyebrow && <span className="card__eyebrow">{eyebrow}</span>}
          {title && <h2 className="card__title">{title}</h2>}
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}
