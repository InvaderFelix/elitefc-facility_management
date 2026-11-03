import { forwardRef, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from './buttonClasses';

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      ...rest
    },
    ref
  ) => (
    <Link
      ref={ref}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...rest}
    >
      {leftIcon && (
        <span className="btn__icon" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span>{children}</span>
      {rightIcon && (
        <span className="btn__icon" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </Link>
  )
);

LinkButton.displayName = 'LinkButton';
