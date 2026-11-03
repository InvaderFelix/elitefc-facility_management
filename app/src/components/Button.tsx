import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonClasses';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      type = 'button',
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    const classes = `${buttonClasses({ variant, size, fullWidth, className })}${
      isLoading ? ' btn--loading' : ''
    }`;

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...rest}
      >
        {isLoading && <span className="btn__spinner" aria-hidden="true" />}
        {!isLoading && leftIcon && (
          <span className="btn__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="btn__icon" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
