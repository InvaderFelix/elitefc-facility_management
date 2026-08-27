import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

/**
 * Standard labeled text field. Works directly with react-hook-form's
 * `register()` spread: <TextInput label="Email" {...register('email')} error={errors.email?.message} />
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, required, id, className = '', ...rest }, ref) => {
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
          className="field__input"
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

TextInput.displayName = 'TextInput';
