/**
 * ExpenseReportDetailsPage
 * Page to view and manage expense report details
 */

import { EditableTitle } from '../components/common/EditableTitle';
import { ExpenseItem } from '../components/expense-reports/ExpenseItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { useExpenseReportDetails } from '../hooks/useExpenseReportDetails';
import { expenseReportsApi } from '../api/expense-reports.api';

interface ExpenseReportDetailsPageProps {
  reportId: string;
  onBack?: () => void;
  onAddExpense?: (expenseId?: string) => void;
  onSubmitReport?: () => void;
  onExpenseEdited?: () => void;
}

export function ExpenseReportDetailsPage({
  reportId,
  onBack,
  onAddExpense,
  onSubmitReport,
}: ExpenseReportDetailsPageProps) {
  const { report, expenses, loading, error } = useExpenseReportDetails(reportId);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Navigate back');
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    try {
      await expenseReportsApi.update(reportId, { purpose: newTitle });
      console.log('Title updated successfully to:', newTitle);
      // The UI will update automatically when the hook refetches
    } catch (error) {
      console.error('Error updating title:', error);
      alert('Failed to update report title. Please try again.');
    }
  };

  const handleExpenseClick = (expenseId: string) => {
    if (onAddExpense) {
      // Navigate to expense details page with the expense ID
      onAddExpense(expenseId);
    }
  };

  const handleAddExpense = () => {
    if (onAddExpense) {
      // Navigate to create expense page (no ID)
      onAddExpense();
    } else {
      console.log('Add expense');
    }
  };

  const handleSubmitReport = () => {
    if (onSubmitReport) {
      onSubmitReport();
    } else {
      console.log('Submit report');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <p className="text-red-500">Error loading report details</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="p-4 bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-content-light dark:text-content-dark hover:bg-subtle-light/10 dark:hover:bg-subtle-dark/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-grow text-content-light dark:text-content-dark">
            Expense Report Details
          </h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 pb-40">
        {/* Editable Title Section */}
        <div className="mb-6">
          <EditableTitle initialTitle={report.purpose} onTitleChange={handleTitleChange} />
          <p className="text-sm text-subtle-light dark:text-subtle-dark mt-1">
            Created on {formatDate(report.createdAt)}
          </p>
        </div>

        {/* Expenses List */}
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-center text-subtle-light dark:text-subtle-dark py-8">
              No expenses yet. Click "Add Expense" to get started.
            </p>
          ) : (
            expenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                category={expense.category}
                name={expense.expenseName || 'Unnamed Expense'}
                amount={expense.amount}
                status={expense.status}
                onClick={() => handleExpenseClick(expense.id)}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer with Action Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm max-w-md mx-auto">
        <div className="space-y-3">
          {/* Submit Report Button */}
          <button
            onClick={handleSubmitReport}
            className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined">send</span>
            <span>Submit Report</span>
          </button>

          {/* Add Expense Button */}
          <button
            onClick={handleAddExpense}
            className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-surface-light dark:bg-surface-dark text-primary dark:text-primary font-bold rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-surface-dark/80 transition-colors"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>Add Expense</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
