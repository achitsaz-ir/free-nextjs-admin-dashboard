// components/ui/Progress.tsx
'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  className?: string;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, indicatorClassName, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 bg-gray-900 transition-all dark:bg-gray-50',
          // Indeterminate animation when value is undefined
          value === undefined && 'animate-pulse',
          indicatorClassName,
        )}
        style={{
          transform: value !== undefined ? `translateX(-${100 - (value || 0)}%)` : undefined,
        }}
      />
    </ProgressPrimitive.Root>
  ),
);
Progress.displayName = ProgressPrimitive.Root.displayName;

// Alternative simpler version without Radix
export function SimpleProgress({
  value,
  className,
  showValue = false,
  variant = 'default',
}: {
  value?: number;
  className?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
}) {
  const variants = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-1 flex items-center justify-between">
        {showValue && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {value !== undefined ? `${Math.round(value)}%` : 'در حال پردازش...'}
          </span>
        )}
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-300 ease-in-out',
            variants[variant],
            value === undefined && 'animate-pulse',
          )}
          style={{
            width: value !== undefined ? `${value}%` : '100%',
          }}
        />
      </div>
    </div>
  );
}

export { Progress };
