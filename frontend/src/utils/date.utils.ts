/**
 * Date Utilities
 * Formatting dates for display
 */

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateInput = (date: Date | null): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

export const parseDateInput = (dateString: string): Date | null => {
  if (!dateString) return null;
  return new Date(dateString);
};
