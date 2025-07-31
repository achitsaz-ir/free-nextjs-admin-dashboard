// components/ui/LoadingSkeleton.tsx
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
}

export default function LoadingSkeleton({
  className,
  count = 1,
  height,
  width,
}: LoadingSkeletonProps) {
  const skeletonClass = cn(
    'animate-pulse rounded-md bg-gray-300 dark:bg-gray-700',
    height && `h-${height}`,
    width && `w-${width}`,
    className,
  );

  if (count === 1) {
    return <div className={skeletonClass} />;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} />
      ))}
    </div>
  );
}

// Pre-made skeleton components
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        <LoadingSkeleton className="h-4 w-32" />
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-4 w-40" />
        <LoadingSkeleton className="h-4 w-28" />
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-40" />
          <LoadingSkeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <LoadingSkeleton className="mb-4 h-6 w-48" />
      <LoadingSkeleton className="mb-2 h-4 w-full" />
      <LoadingSkeleton className="mb-4 h-4 w-3/4" />
      <div className="flex gap-4">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <LoadingSkeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <LoadingSkeleton className="h-6 w-16 rounded-full" />
            <LoadingSkeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <LoadingSkeleton className="mb-2 h-4 w-24" />
            <LoadingSkeleton className="mb-1 h-8 w-16" />
            <LoadingSkeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <LoadingSkeleton className="mb-4 h-6 w-32" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <LoadingSkeleton className="mb-4 h-6 w-40" />
        <TableSkeleton />
      </div>
    </div>
  );
}
