import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      isLoading = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-primary hover:bg-primary-hover text-white',
      secondary: 'bg-secondary hover:bg-secondary-hover text-white',
      outline: 'border border-primary bg-transparent text-primary hover:bg-primary/10',
      ghost: 'bg-transparent hover:bg-surface text-text-primary',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg',
      md: 'text-sm px-4 py-2 rounded-lg',
      lg: 'text-base px-6 py-3 rounded-xl',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'font-medium transition-all flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '',
          className
        )}
        disabled={disabled || isLoading}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4 mr-2\" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}

        {icon && iconPosition === 'left' && !isLoading && icon}
        {children}
        {icon && iconPosition === 'right' && !isLoading && icon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';