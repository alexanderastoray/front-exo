/**
 * ActiveFilters Component
 * Displays active filters as removable pills
 */

import { FilterState } from '../../types/filter.types';
import { FilterPill } from '../common/FilterPill';
import { STATUS_LABELS } from '../../constants/statuses';
import { CATEGORY_LABELS } from '../../constants/categories';

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveStatus: () => void;
  onRemoveSort: () => void;
  onRemoveCategory: (index: number) => void;
}

export function ActiveFilters({
  filters,
  onRemoveStatus,
  onRemoveSort,
  onRemoveCategory,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.status.length > 0 ||
    (filters.sortBy === 'amount' && filters.sortOrder === 'desc');

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
      {filters.status.length > 0 && (
        <FilterPill
          label={`Status: ${filters.status.map((s) => STATUS_LABELS[s]).join(', ')}`}
          onRemove={onRemoveStatus}
        />
      )}

      {filters.sortBy === 'amount' && filters.sortOrder === 'desc' && (
        <FilterPill
          label="Amount: High to Low"
          onRemove={onRemoveSort}
        />
      )}

      {filters.categories.map((category, index) => (
        <FilterPill
          key={category}
          label={`Category: ${CATEGORY_LABELS[category]}`}
          onRemove={() => onRemoveCategory(index)}
        />
      ))}
    </div>
  );
}
