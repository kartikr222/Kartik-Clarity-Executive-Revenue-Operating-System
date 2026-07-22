import React from 'react';
import { cn } from '@/utils/index';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, type = 'text', ...props },
    ref,
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-secondary-900 dark:text-white">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-base text-secondary-900 placeholder-secondary-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-secondary-50 disabled:text-secondary-500 dark:border-secondary-600 dark:bg-secondary-900 dark:text-white dark:placeholder-secondary-400 dark:focus:border-primary-400 dark:focus:ring-primary-400',
            error &&
              'border-danger-500 focus:border-danger-500 focus:ring-danger-500 dark:border-danger-500',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-secondary-500 dark:text-secondary-400">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
