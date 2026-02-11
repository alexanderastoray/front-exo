/**
 * App Component
 * Main application component with routing
 */

import { useState } from 'react';
import { ExpenseReportsPage } from './pages/ExpenseReportsPage';
import { CreateExpensePage } from './pages/CreateExpensePage';
import { NewReportPage } from './pages/NewReportPage';
import { ExpenseReportDetailsPage } from './pages/ExpenseReportDetailsPage';
import { ExpenseDetailsPage } from './pages/ExpenseDetailsPage';
import { ProfilePage } from './pages/ProfilePage';

type Page = 'reports' | 'create-expense' | 'new-report' | 'report-details' | 'expense-details' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('reports');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | undefined>(undefined);

  // Simple navigation without router
  const navigateToCreateExpense = (expenseId?: string) => {
    setSelectedExpenseId(expenseId);
    setCurrentPage('create-expense');
  };
  const navigateToExpenseDetails = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setCurrentPage('expense-details');
  };
  const navigateToNewReport = () => setCurrentPage('new-report');
  const navigateToReportDetails = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentPage('report-details');
  };
  const navigateToReports = () => {
    setSelectedExpenseId(undefined);
    setCurrentPage('reports');
  };
  const navigateToProfile = () => setCurrentPage('profile');

  if (currentPage === 'create-expense') {
    return (
      <CreateExpensePage
        expenseId={selectedExpenseId}
        reportId={selectedReportId || undefined}
        onClose={() => {
          // If we have a selected report, go back to report details
          if (selectedReportId) {
            navigateToReportDetails(selectedReportId);
          } else {
            navigateToReports();
          }
        }}
      />
    );
  }

  if (currentPage === 'new-report') {
    return <NewReportPage onClose={navigateToReports} />;
  }

  if (currentPage === 'report-details' && selectedReportId) {
    return (
      <ExpenseReportDetailsPage
        reportId={selectedReportId}
        onBack={navigateToReports}
        onAddExpense={(expenseId) => {
          if (expenseId) {
            // Navigate to expense details view
            navigateToExpenseDetails(expenseId);
          } else {
            // Navigate to create new expense
            navigateToCreateExpense();
          }
        }}
        onExpenseEdited={() => {
          // Refresh the report details page
          navigateToReportDetails(selectedReportId);
        }}
      />
    );
  }

  if (currentPage === 'expense-details' && selectedExpenseId) {
    return (
      <ExpenseDetailsPage
        expenseId={selectedExpenseId}
        onBack={() => {
          // Go back to report details if we have a selected report
          if (selectedReportId) {
            navigateToReportDetails(selectedReportId);
          } else {
            navigateToReports();
          }
        }}
        onEdit={(expenseId) => {
          navigateToCreateExpense(expenseId);
        }}
      />
    );
  }

  if (currentPage === 'profile') {
    return (
      <ProfilePage
        onNavigateToReports={navigateToReports}
        onNavigateToSubmit={navigateToNewReport}
      />
    );
  }

  return (
    <ExpenseReportsPage
      onCreateReport={navigateToNewReport}
      onViewReport={navigateToReportDetails}
      onNavigateToProfile={navigateToProfile}
    />
  );
}

export default App;
