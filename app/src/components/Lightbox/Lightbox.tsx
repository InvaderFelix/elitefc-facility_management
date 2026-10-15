import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useEscapeKey } from "../../hooks/useEscapeKey";

interface LightboxProps {
  /** BEM block name, e.g. "coach-lightbox" — drives the `__panel`/`__close` classes. */
  variant: string;
  /** Toggles the `--open` modifier; the parent controls mounting (close animations). */
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  /** Panel content. */
  children: ReactNode;
  /** Overlay-level extras, e.g. prev/next buttons (rendered beside the panel). */
  nav?: ReactNode;
}

export function Lightbox({
  variant,
  open,
  onClose,
  ariaLabel,
  children,
  nav,
}: LightboxProps) {
  useBodyScrollLock(true);
  useEscapeKey(onClose);

  return createPortal(
    <div
      className={`${variant}${open ? ` ${variant}--open` : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div className={`${variant}__panel`} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={`${variant}__close`}
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
      {nav}
    </div>,
    document.body,
  );
}
