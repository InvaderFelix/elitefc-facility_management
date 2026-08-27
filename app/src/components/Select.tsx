import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { ErrorMessage } from './ErrorMessage';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
}

/*
 * Labeled select. Intended use includes fixed-vocabulary fields like
 * parent_child_relationship.relationship_type once that enum is finalized:
 * <Select label="Relationship" options={RELATIONSHIP_TYPE_OPTIONS} ... />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hint, required, id, placeholder, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
        <label htmlFor={selectId} className="field__label">
          {label}
          {required && (
            <span className="field__required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
        <select
          ref={ref}
          id={selectId}
          className="field__input field__input--select"
          aria-invalid={!!error}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          required={required}
          defaultValue={rest.defaultValue ?? ''}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';
