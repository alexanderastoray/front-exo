/**
 * ExpenseItem Component
 * Display a single expense item with icon, name, amount and status
 */

import { CategoryIcon } from '../common/CategoryIcon';
import { ExpenseCategory, ExpenseStatus } from '../../types/expense-report.types';

interface ExpenseItemProps {
  category: ExpenseCategory;
  name: string;
  amount: number;
  status: ExpenseStatus;
  onClick?: () => void;
}

const STATUS_STYLES = {
  [ExpenseStatus.CREATED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  [ExpenseStatus.SUBMITTED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ExpenseStatus.VALIDATED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ExpenseStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [ExpenseStatus.PAID]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

const STATUS_LABELS = {
  [ExpenseStatus.CREATED]: 'Created',
  [ExpenseStatus.SUBMITTED]: 'Submitted',
  [ExpenseStatus.VALIDATED]: 'Accepted',
  [ExpenseStatus.REJECTED]: 'Denied',
  [ExpenseStatus.PAID]: 'Paid',
};

export function ExpenseItem({ category, name, amount, status, onClick }: ExpenseItemProps) {
  return (
    <div
      className="bg-surface-light dark:bg-surface-dark rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-surface-dark/80 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary">
          <CategoryIcon category={category} />
        </div>

        {/* Expense Info */}
        <div className="flex-grow">
          <p className="font-semibold text-content-light dark:text-content-dark">{name}</p>
          <p className="text-sm text-subtle-light dark:text-subtle-dark">
            ${amount.toFixed(2)}
          </p>
        </div>

        {/* Status Badge */}
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
            {STATUS_LABELS[status]}
          </span>
        </div>
      </div>
    </div>
  );
}
