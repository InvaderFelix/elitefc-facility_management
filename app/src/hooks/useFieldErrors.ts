import { useCallback, useState } from "react";

/*
 * One piece of state for a form's field errors instead of a useState per field.
 * Keyed by the field name so callers read `errors.email` instead of juggling a
 * dozen `setXError` setters.
 */
export function useFieldErrors<K extends string>() {
  const [errors, setErrors] = useState<Partial<Record<K, string>>>({});

  const setFieldError = useCallback((field: K, error: string | undefined) => {
    setErrors((prev) => {
      if (!error && !(field in prev)) return prev;
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  }, []);

  const setAll = useCallback((next: Partial<Record<K, string>>) => {
    setErrors(next);
  }, []);

  const clear = useCallback(() => setErrors({}), []);

  return { errors, setFieldError, setAll, clear };
}
