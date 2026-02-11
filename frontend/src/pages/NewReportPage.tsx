/**
 * NewReportPage
 * Page for creating a new expense report
 */

import { useState } from 'react';
import { SuccessModal } from '../components/common/SuccessModal';
import { expenseReportsApi } from '../api/expense-reports.api';

interface ReportFormData {
  purpose: string;
  date: string;
}

interface NewReportPageProps {
  onClose?: () => void;
  onCreate?: (data: ReportFormData) => void;
}

export function NewReportPage({ onClose, onCreate }: NewReportPageProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    purpose: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      console.log('Cancel - navigate back');
    }
  };

  const handleCreate = async () => {
    // Validation
    if (!formData.purpose.trim()) {
      setError('Please enter a purpose for the report');
      return;
    }

    if (formData.purpose.trim().length < 5) {
      setError('Purpose must be at least 5 characters long');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const payload = {
        purpose: formData.purpose,
        reportDate: formData.date,
      };
      
      console.log('Sending to API:', payload);

      // Call API to create report
      const newReport = await expenseReportsApi.create(payload);

      console.log('Report created successfully:', newReport);

      // Call onCreate callback if provided
      if (onCreate) {
        onCreate(formData);
      }

      // Show success modal
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Error creating report:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to create report. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Navigate back after closing modal
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-screen justify-between bg-background-light dark:bg-background-dark font-display">
      {/* Main Content */}
      <main className="flex-grow">
        {/* Header */}
        <header className="p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCancel}
              className="text-text-light dark:text-text-dark hover:bg-subtle-light dark:hover:bg-subtle-dark p-2 rounded-lg transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-text-light dark:text-text-dark flex-grow text-center">
              New Report
            </h1>
            <div className="w-6" />
          </div>
        </header>

        {/* Form */}
        <div className="p-4 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Purpose Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-text-light/80 dark:text-text-dark/80"
              htmlFor="purpose"
            >
              Purpose
            </label>
            <input
              className="w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg h-14 px-4 text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark focus:ring-2 focus:ring-primary focus:outline-none"
              id="purpose"
              name="purpose"
              placeholder="e.g. Q3 Client Meeting"
              type="text"
              value={formData.purpose}
              onChange={handleInputChange}
              disabled={isCreating}
            />
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-text-light/80 dark:text-text-dark/80"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className="w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg h-14 px-4 text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark focus:ring-2 focus:ring-primary focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 pb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="w-full bg-gray-200 dark:bg-surface-dark text-gray-700 dark:text-gray-300 font-bold h-14 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-surface-dark/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full bg-primary text-white font-bold h-14 rounded-lg flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Report'}
          </button>
        </div>
      </footer>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Submitted Successfully"
        message="Your expense report has been created and is now pending review."
        onClose={handleSuccessModalClose}
      />
    </div>
  );
}
