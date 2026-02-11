/**
 * FilterModal Component
 * Modal for filtering and sorting expense reports
 */

import { useState } from 'react';
import { FilterState, FilterKey } from '../../types/filter.types';
import { ReportStatus, ExpenseCategory } from '../../types/expense-report.types';
import { Button } from '../common/Button';
import { FILTER_STATUSES, STATUS_BG_COLORS, STATUS_LABELS } from '../../constants/statuses';
import { FILTER_CATEGORIES } from '../../constants/categories';
import { formatDateInput, parseDateInput } from '../../utils/date.utils';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
}

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
  onClear,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    onClear();
    onClose();
  };

  const toggleStatus = (status: ReportStatus) => {
    setLocalFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const toggleCategory = (category: ExpenseCategory) => {
    setLocalFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-20"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background-light dark:bg-background-dark rounded-t-xl shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">
            Filter & Sort
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-muted-light dark:text-muted-dark">
              close
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto pb-24">
          {/* Status */}
          <div>
            <h3 className="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
              Status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLocalFilters((prev) => ({ ...prev, status: [] }))}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left ${
                  localFilters.status.length === 0
                    ? 'bg-primary/10 border border-primary/20 text-primary'
                    : 'bg-white dark:bg-white/10 text-foreground-light dark:text-foreground-dark border border-gray-200 dark:border-white/20'
                }`}
              >
                All
              </button>
              {FILTER_STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => toggleStatus(status.value)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left border ${
                    localFilters.status.includes(status.value)
                      ? STATUS_BG_COLORS[status.value]
                      : 'bg-white dark:bg-white/10 text-foreground-light dark:text-foreground-dark border-gray-200 dark:border-white/20'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
              Date Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start-date"
                  className="text-sm text-muted-light dark:text-muted-dark"
                >
                  From
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={formatDateInput(localFilters.dateFrom)}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      dateFrom: parseDateInput(e.target.value),
                    }))
                  }
                  className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-background-dark/50 text-foreground-light dark:text-foreground-dark border border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="end-date"
                  className="text-sm text-muted-light dark:text-muted-dark"
                >
                  To
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={formatDateInput(localFilters.dateTo)}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      dateTo: parseDateInput(e.target.value),
                    }))
                  }
                  className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-background-dark/50 text-foreground-light dark:text-foreground-dark border border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div>
            <h3 className="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
              Total Amount
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={localFilters.amountMax}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    amountMax: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
              />
              <div className="flex justify-between text-sm text-muted-light dark:text-muted-dark">
                <span>$0</span>
                <span>${localFilters.amountMax}+</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground-light dark:text-foreground-dark mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {FILTER_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => toggleCategory(category.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                    localFilters.categories.includes(category.value)
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-white dark:bg-white/10 text-foreground-light dark:text-foreground-dark border-gray-200 dark:border-white/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {category.icon}
                  </span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-white/10">
          <div className="flex gap-4">
            <Button onClick={handleClear} variant="secondary" fullWidth>
              Clear
            </Button>
            <Button onClick={handleApply} variant="primary" fullWidth>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
