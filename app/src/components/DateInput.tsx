import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'min' | 'max'> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  /* ISO date string (yyyy-mm-dd), e.g. earliest allowed date of birth */
  minDate?: string;
  /* ISO date string (yyyy-mm-dd), e.g. today, to prevent future DOBs */
  maxDate?: string;
}

/*
 * Date field, primarily for date_of_birth entry (parent's own DOB isn't
 * currently collected, but this covers child DOB and any future use).
 * Kept separate from TextInput since min/max date bounds are date-specific.
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, hint, required, id, minDate, maxDate, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
        <label htmlFor={inputId} className="field__label">
          {label}
          {required && (
            <span className="field__required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        <input
          ref={ref}
          id={inputId}
          type="date"
          className="field__input field__input--date"
          min={minDate}
          max={maxDate}
          aria-invalid={!!error}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          required={required}
          {...rest}
        />
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

DateInput.displayName = 'DateInput';
