/**
 * ExpenseReportCard Component
 * Displays a single expense report card
 */

import { ExpenseReport, ExpenseCategory } from '../../types/expense-report.types';
import { Badge } from '../common/Badge';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatDate } from '../../utils/date.utils';
import { formatCurrency } from '../../utils/currency.utils';

interface ExpenseReportCardProps {
  report: ExpenseReport;
  onClick?: () => void;
}

export function ExpenseReportCard({ report, onClick }: ExpenseReportCardProps) {
  // Extract unique categories from expenses
  const categories: ExpenseCategory[] = [
    ...new Set(report.expenses?.map((e) => e.category) || []),
  ];

  return (
    <div
      className="bg-white dark:bg-background-dark/50 p-4 rounded-xl shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-foreground-light dark:text-foreground-dark font-semibold">
            {report.purpose}
          </p>
          <p className="text-sm text-muted-light dark:text-muted-dark">
            {formatDate(report.reportDate)}
          </p>
        </div>
        <p className="text-lg font-bold text-primary">
          {formatCurrency(report.totalAmount)}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {categories.map((category) => (
            <CategoryIcon key={category} category={category} />
          ))}
        </div>
        <Badge status={report.status} />
      </div>
    </div>
  );
}
