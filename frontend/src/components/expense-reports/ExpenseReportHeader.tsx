/**
 * ExpenseReportHeader Component
 * Header with title and create button
 */

import { IconButton } from '../common/IconButton';

interface ExpenseReportHeaderProps {
  onCreateClick?: () => void;
}

export function ExpenseReportHeader({ onCreateClick }: ExpenseReportHeaderProps) {
  return (
    <header className="sticky top-0 bg-background-light dark:bg-background-dark/80 backdrop-blur-sm z-10">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
        <div className="w-10"></div>
        <h1 className="text-lg font-bold text-foreground-light dark:text-foreground-dark">
          Expense Reports
        </h1>
        <IconButton
          icon="add"
          onClick={onCreateClick}
          ariaLabel="Create new expense report"
        />
      </div>
    </header>
  );
}
