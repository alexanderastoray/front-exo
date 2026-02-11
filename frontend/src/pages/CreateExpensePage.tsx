/**
 * CreateExpensePage
 * Page for creating or editing an expense
 */

import { useState, useEffect } from 'react';
import { FormInput } from '../components/common/FormInput';
import { FormSelect } from '../components/common/FormSelect';
import { FormTextarea } from '../components/common/FormTextarea';
import { FileUpload } from '../components/common/FileUpload';
import { DateSelector } from '../components/common/DateSelector';
import { useExpense } from '../hooks/useExpense';
import { expensesApi } from '../api/expenses.api';
import LoadingSpinner from '../components/LoadingSpinner';

interface ExpenseFormData {
  category: string;
  amount: string;
  expenseName: string;
  description: string;
  reportDate: string;
  expenseDate: string;
  attachments: File[];
}

interface CreateExpensePageProps {
  expenseId?: string;
  reportId?: string;
  onClose?: () => void;
  onSave?: (data: ExpenseFormData) => void;
}

export function CreateExpensePage({
  expenseId,
  reportId,
  onClose,
  onSave,
}: CreateExpensePageProps) {
  const isEditMode = !!expenseId;
  const { expense, loading } = useExpense(expenseId);

  const [formData, setFormData] = useState<ExpenseFormData>({
    category: 'TRAVEL',
    amount: '',
    expenseName: '',
    description: '',
    reportDate: new Date().toISOString().split('T')[0],
    expenseDate: new Date().toISOString().split('T')[0],
    attachments: [],
  });

  // Load expense data when in edit mode
  useEffect(() => {
    if (expense && isEditMode) {
      setFormData({
        category: expense.category,
        amount: expense.amount.toString(),
        expenseName: expense.expenseName || '',
        description: expense.description || '',
        reportDate: expense.expenseDate, // Using expense date as report date for now
        expenseDate: expense.expenseDate,
        attachments: [],
      });
    }
  }, [expense, isEditMode]);

  const categoryOptions = [
    { value: 'TRAVEL', label: 'Travel' },
    { value: 'MEALS', label: 'Meals' },
    { value: 'ACCOMMODATION', label: 'Accommodation' },
    { value: 'TRANSPORT', label: 'Transport' },
    { value: 'OFFICE_SUPPLIES', label: 'Office Supplies' },
    { value: 'COMMUNICATION', label: 'Communication' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const handleExpenseDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, expenseDate: date }));
  };

  const handleReportDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, reportDate: date }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      console.log('Cancel - navigate back');
      // TODO: Navigate back when router is implemented
    }
  };

  const handleSave = async () => {
    try {
      // Validate amount
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        console.error('Invalid amount');
        alert('Please enter a valid amount greater than 0');
        return;
      }

      // Use date in YYYY-MM-DD format (ISO 8601 date-only format)
      const expenseDate = formData.expenseDate;

      if (isEditMode && expenseId) {
        // Update existing expense
        await expensesApi.update(expenseId, {
          category: formData.category,
          expenseName: formData.expenseName || undefined,
          description: formData.description || undefined,
          amount,
          expenseDate,
        });
        console.log('Expense updated successfully');
      } else if (reportId) {
        // Create new expense
        await expensesApi.create({
          reportId,
          category: formData.category,
          expenseName: formData.expenseName || undefined,
          description: formData.description || undefined,
          amount,
          expenseDate,
        });
        console.log('Expense created successfully');
      } else {
        console.error('Cannot create expense: reportId is missing');
        return;
      }

      if (onSave) {
        onSave(formData);
      }

      // Navigate back
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense. Please try again.');
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen justify-between bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div>
        <header className="p-4 flex items-center">
          <button
            onClick={handleCancel}
            className="p-2 text-foreground-light dark:text-foreground-dark hover:bg-subtle-light dark:hover:bg-subtle-dark rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h1 className="flex-1 text-center font-bold text-lg text-foreground-light dark:text-foreground-dark pr-8">
            {isEditMode ? 'Edit Expense' : 'Add Expense'}
          </h1>
        </header>

        {/* Main Content */}
        <main className="px-4 space-y-6 pb-4">
          {/* Category and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Category"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={categoryOptions}
            />
            <FormInput
              label="Amount"
              id="amount"
              name="amount"
              type="text"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              prefix="$"
            />
          </div>

          {/* Expense Name */}
          <FormInput
            label="Expense Name"
            id="expenseName"
            name="expenseName"
            type="text"
            value={formData.expenseName}
            onChange={handleInputChange}
            placeholder="e.g. Client Dinner"
            optional
          />

          {/* Description */}
          <FormTextarea
            label="Description"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="A short description of the expense"
            optional
          />

          {/* File Upload */}
          <FileUpload onFilesChange={handleFilesChange} />

          {/* Dates */}
          <div className="space-y-2 pt-2">
            <DateSelector
              label="Report Date"
              date={formData.reportDate}
              readOnly
            />
            <DateSelector
              label="Expense Date"
              date={formData.expenseDate}
              onDateChange={handleExpenseDateChange}
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="p-4 bg-background-light dark:bg-background-dark border-t border-subtle-light dark:border-subtle-dark">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCancel}
            className="w-full bg-gray-200 dark:bg-surface-dark text-gray-700 dark:text-gray-300 font-bold h-14 rounded-xl flex items-center justify-center hover:bg-gray-300 dark:hover:bg-surface-dark/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full bg-primary text-white font-bold h-14 rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </footer>
    </div>
  );
}
