import { type HTMLAttributes, type ReactNode } from 'react';

interface ErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

/*
 * Inline field/form error text. Renders nothing if `children` is falsy,
 * so callers can do `{error && <ErrorMessage>{error}</ErrorMessage>}`
 * or just pass `error` straight through without a guard.
 */
export function ErrorMessage({ children, className = '', ...rest }: ErrorMessageProps) {
  if (!children) return null;

  return (
    <p role="alert" className={`error-message ${className}`.trim()} {...rest}>
      <span className="error-message__icon" aria-hidden="true">
        !
      </span>
      <span className="error-message__text">{children}</span>
    </p>
  );
}
