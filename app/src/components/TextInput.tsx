import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
}

/**
 * Standard labeled text field. Forwards its ref, so it works with a plain
 * uncontrolled <input> or any form library that hands you a ref:
 * <TextInput label="Email" name="email" error={errors.email} />
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, required, id, className = '', type = 'text', ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    /*
     * Password fields get a show/hide toggle. The real input keeps its
     * password type so browsers and password managers still treat it as such.
     */
    const [revealed, setRevealed] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && revealed ? 'text' : type;

    return (
      <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
        <label htmlFor={inputId}>
          {label}
          {required && (
            <span className="field__required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        <div className={isPassword ? 'field__control' : undefined}>
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className="field__input"
            aria-invalid={!!error}
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
            required={required}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              className="field__toggle"
              onClick={() => setRevealed((value) => !value)}
              aria-label={revealed ? 'Hide password' : 'Show password'}
              aria-pressed={revealed}
            >
              {revealed ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
        {hint && !error && (
          <p id={hintId} className="field__hint">
            {hint}
          </p>
        )}
        <ErrorMessage id={errorId}>{error}</ErrorMessage>
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
