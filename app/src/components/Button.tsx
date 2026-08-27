import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

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
    const classes = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      fullWidth ? 'btn--full' : '',
      isLoading ? 'btn--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

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
          <span className="btn__icon btn__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="btn__label">{children}</span>
        {!isLoading && rightIcon && (
          <span className="btn__icon btn__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
