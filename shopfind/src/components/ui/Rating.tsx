import { Star } from 'lucide-react';
import { cn } from '../../utils';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({ value, onChange, readonly = false, size = 'md' }: RatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={cn(
            'transition-colors duration-150',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
            star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          )}
        >
          <Star className={sizes[size]} />
        </button>
      ))}
    </div>
  );
}

export function RatingDisplay({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizes[size],
            star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-600">{value.toFixed(1)}</span>
    </div>
  );
}
