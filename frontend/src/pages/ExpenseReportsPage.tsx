/**
 * ExpenseReportsPage
 * Main page for viewing and filtering expense reports
 */

import { useState, useMemo } from 'react';
import { useExpenseReports } from '../hooks/useExpenseReports';
import { useFilters } from '../hooks/useFilters';
import { useSearch } from '../hooks/useSearch';
import { ExpenseReportHeader } from '../components/expense-reports/ExpenseReportHeader';
import { SearchInput } from '../components/common/SearchInput';
import { Button } from '../components/common/Button';
import { ActiveFilters } from '../components/expense-reports/ActiveFilters';
import { ExpenseReportList } from '../components/expense-reports/ExpenseReportList';
import { FilterModal } from '../components/expense-reports/FilterModal';
import { Footer } from '../components/layout/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { ExpenseReport } from '../types/expense-report.types';

export function ExpenseReportsPage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Fetch reports
  const { reports, loading, error } = useExpenseReports();

  // Filters and search
  const { filters, setFilter, clearFilters, applyFilters, activeFilterCount } =
    useFilters();
  const { searchTerm, setSearchTerm, applySearch } = useSearch();

  // Apply filters and search
  const filteredReports = useMemo(() => {
    let result = reports;
    result = applyFilters(result);
    result = applySearch(result);
    return result;
  }, [reports, applyFilters, applySearch]);

  // Handlers
  const handleCreateClick = () => {
    console.log('Create new expense report');
    // TODO: Navigate to create page
  };

  const handleReportClick = (report: ExpenseReport) => {
    console.log('View report:', report.id);
    // TODO: Navigate to report detail page
  };

  const handleRemoveStatusFilter = () => {
    setFilter('status', []);
  };

  const handleRemoveSortFilter = () => {
    setFilter('sortBy', 'date');
    setFilter('sortOrder', 'desc');
  };

  const handleRemoveCategoryFilter = (index: number) => {
    const newCategories = [...filters.categories];
    newCategories.splice(index, 1);
    setFilter('categories', newCategories);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      setFilter(key as any, value);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <ExpenseReportHeader onCreateClick={handleCreateClick} />

      {/* Main Content */}
      <main className="flex-grow pb-24">
        <div className="p-4 space-y-4">
          {/* Search */}
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search reports..."
          />

          {/* Filter Button */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsFilterModalOpen(true)}
              variant="ghost"
              size="md"
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">tune</span>
                <span>Filter & Sort</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
            </Button>
          </div>

          {/* Active Filters */}
          <ActiveFilters
            filters={filters}
            onRemoveStatus={handleRemoveStatusFilter}
            onRemoveSort={handleRemoveSortFilter}
            onRemoveCategory={handleRemoveCategoryFilter}
          />
        </div>

        {/* Reports List */}
        <div className="px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading reports: {error.message}</p>
            </div>
          ) : (
            <ExpenseReportList
              reports={filteredReports}
              onReportClick={handleReportClick}
            />
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      <Footer activeTab="reports" />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
        onClear={clearFilters}
      />
    </div>
  );
}
