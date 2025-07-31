// components/ui/ErrorMessage.tsx
'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/navigation';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({
  title = 'خطایی رخ داده است',
  message = 'متأسفانه در بارگیری اطلاعات مشکلی پیش آمده است.',
  showRetry = true,
  showHome = false,
  onRetry,
  className = '',
}: ErrorMessageProps) {
  const router = useRouter();

  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}
    >
      {/* Error Icon */}
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>

      {/* Error Content */}
      <div className="max-w-md">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="primary" className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            تلاش مجدد
          </Button>
        )}

        {showHome && (
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            بازگشت به خانه
          </Button>
        )}
      </div>
    </div>
  );
}

// Pre-made error components
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      title="مشکل در اتصال"
      message="لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید."
      onRetry={onRetry}
      showHome
    />
  );
}

export function NotFoundError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      title="اطلاعات یافت نشد"
      message="اطلاعات درخواستی شما یافت نشد یا ممکن است حذف شده باشد."
      onRetry={onRetry}
      showHome
    />
  );
}

export function UnauthorizedError() {
  const router = useRouter();

  return (
    <ErrorMessage
      title="دسترسی محدود"
      message="شما مجوز دسترسی به این بخش را ندارید."
      showRetry={false}
      showHome
    />
  );
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorMessage
      title="خطای سرور"
      message="مشکلی در سرور رخ داده است. لطفاً چند دقیقه دیگر تلاش کنید."
      onRetry={onRetry}
      showHome
    />
  );
}

// Inline Error (for forms, cards, etc.)
export function InlineError({
  message,
  onRetry,
  className = '',
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`rounded-md bg-red-50 p-4 dark:bg-red-900/20 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="mr-3 flex-1">
          <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
        </div>
        {onRetry && (
          <div className="mr-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Empty State
export function EmptyState({
  icon = '📄',
  title = 'اطلاعاتی موجود نیست',
  message = 'هنوز اطلاعاتی در این بخش ثبت نشده است.',
  actionLabel,
  onAction,
  className = '',
}: {
  icon?: string | React.ReactNode;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-12 text-center ${className}`}
    >
      <div className="mb-4 text-6xl">{typeof icon === 'string' ? icon : icon}</div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>

      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">{message}</p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
