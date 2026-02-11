/**
 * CategoryIcon Component
 * Displays category icons using Material Symbols
 */

import { ExpenseCategory } from '../../types/expense-report.types';
import { getCategoryIcon } from '../../utils/category.utils';

interface CategoryIconProps {
  category: ExpenseCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryIcon({ category, size = 'md', className = '' }: CategoryIconProps) {
  const icon = getCategoryIcon(category);

  const sizeClasses = {
    sm: 'size-6 text-base',
    md: 'size-8 text-lg',
    lg: 'size-10 text-xl',
  };

  return (
    <div
      className={`flex items-center justify-center ${sizeClasses[size]} rounded-full bg-primary/10 ${className}`}
    >
      <span className="material-symbols-outlined text-primary">{icon}</span>
    </div>
  );
}
