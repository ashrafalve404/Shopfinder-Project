import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded-lg', className)} />
  );
}

export function ShopCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <Skeleton className="h-40 w-full rounded-lg mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
      <Skeleton className="h-5 w-24 mx-auto" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <Skeleton className="h-32 w-full rounded-lg mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-primary-600', sizes[size])} />
    </div>
  );
}
