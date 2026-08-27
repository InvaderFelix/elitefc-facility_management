import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  /* Supporting text, e.g. explaining what an authority flag grants */
  description?: string;
  error?: string;
}

/*
 * Labeled checkbox with room for a description line underneath — built
 * with the parent_child_relationship authority flags in mind
 * (pickup_authority, medical_authority, financial_responsibility, etc.),
 * where the label alone isn't enough to convey what's being granted.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, id, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descId = description ? `${inputId}-desc` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className={`checkbox-field ${error ? 'checkbox-field--error' : ''} ${className}`.trim()}>
        <div className="checkbox-field__row">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="checkbox-field__input"
            aria-invalid={!!error}
            aria-describedby={[descId, errorId].filter(Boolean).join(' ') || undefined}
            {...rest}
          />
          <label htmlFor={inputId} className="checkbox-field__label">
            {label}
          </label>
        </div>
        {description && (
          <p id={descId} className="checkbox-field__description">
            {description}
          </p>
        )}
        <ErrorMessage id={errorId}>{error}</ErrorMessage>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
