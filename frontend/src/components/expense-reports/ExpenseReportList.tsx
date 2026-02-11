/**
 * ExpenseReportList Component
 * Displays a list of expense report cards
 */

import { ExpenseReport } from '../../types/expense-report.types';
import { ExpenseReportCard } from './ExpenseReportCard';

interface ExpenseReportListProps {
  reports: ExpenseReport[];
  onReportClick?: (report: ExpenseReport) => void;
}

export function ExpenseReportList({ reports, onReportClick }: ExpenseReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-light dark:text-muted-dark">
          No expense reports found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ExpenseReportCard
          key={report.id}
          report={report}
          onClick={() => onReportClick?.(report)}
        />
      ))}
    </div>
  );
}
