import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchAddressSuggestions,
  type AddressSuggestion,
} from "../lib/register/addressLookup";

const MIN_QUERY_LENGTH = 5;
const DEBOUNCE_MS = 500;
const RATE_LIMIT_MS = 2000;

/*
 * Debounced, abortable, rate-limit-aware address search. Owns only the query
 * and its suggestions; the caller decides what to do with a chosen result.
 */
export function useAddressLookup() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const debounceRef = useRef<number | undefined>(undefined);
  const retryRef = useRef<number | undefined>(undefined);
  const controllerRef = useRef<AbortController | null>(null);
  const lastLookupAtRef = useRef<number | undefined>(undefined);

  const cancelTimers = useCallback(() => {
    if (debounceRef.current !== undefined) window.clearTimeout(debounceRef.current);
    if (retryRef.current !== undefined) window.clearTimeout(retryRef.current);
  }, []);

  const search = useCallback(
    (value: string) => {
      setQuery(value);
      cancelTimers();
      controllerRef.current?.abort();

      if (value.trim().length < MIN_QUERY_LENGTH) {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      const controller = new AbortController();
      controllerRef.current = controller;

      debounceRef.current = window.setTimeout(() => {
        const delay = Math.max(
          RATE_LIMIT_MS,
          (lastLookupAtRef.current ?? 0) + RATE_LIMIT_MS - Date.now(),
        );

        retryRef.current = window.setTimeout(async () => {
          try {
            const results = await fetchAddressSuggestions(
              value.trim(),
              controller.signal,
            );
            lastLookupAtRef.current = Date.now();
            setSuggestions(results);
            setShowSuggestions(true);
            setError(undefined);
          } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") return;
            setSuggestions([]);
            setShowSuggestions(false);
            setError(
              err instanceof Error && err.message === "rate-limited"
                ? "Address lookup is currently rate-limited. Please wait a moment and try again, or enter your address manually."
                : "Address lookup failed. Please type your address manually.",
            );
          } finally {
            if (!controller.signal.aborted) setLoading(false);
          }
        }, delay);
      }, DEBOUNCE_MS);
    },
    [cancelTimers],
  );

  const clear = useCallback(() => {
    cancelTimers();
    controllerRef.current?.abort();
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setLoading(false);
    setError(undefined);
  }, [cancelTimers]);

  const dismiss = useCallback(() => setShowSuggestions(false), []);

  useEffect(
    () => () => {
      cancelTimers();
      controllerRef.current?.abort();
    },
    [cancelTimers],
  );

  return {
    query,
    suggestions,
    showSuggestions,
    loading,
    error,
    search,
    clear,
    dismiss,
  };
}
