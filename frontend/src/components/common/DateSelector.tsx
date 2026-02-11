/**
 * DateSelector Component
 * Date selector with formatted display and native date picker
 */

import { useRef } from 'react';

interface DateSelectorProps {
  label: string;
  date: string;
  onDateChange?: (date: string) => void;
  readOnly?: boolean;
}

export function DateSelector({
  label,
  date,
  onDateChange,
  readOnly = false,
}: DateSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleClick = () => {
    if (!readOnly && inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onDateChange) {
      onDateChange(e.target.value);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-between p-4 rounded-lg bg-subtle-light dark:bg-subtle-dark ${
        !readOnly ? 'cursor-pointer hover:bg-subtle-light/80 dark:hover:bg-subtle-dark/80' : ''
      }`}
      onClick={handleClick}
    >
      <span className="text-foreground-light dark:text-foreground-dark">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className={`font-medium ${
            readOnly
              ? 'text-foreground-light dark:text-foreground-dark'
              : 'text-primary'
          }`}
        >
          {formatDate(date)}
        </span>
        {!readOnly && (
          <>
            <span className="material-symbols-outlined text-foreground-light/60 dark:text-foreground-dark/60 text-sm">
              arrow_forward_ios
            </span>
            <input
              ref={inputRef}
              type="date"
              value={date}
              onChange={handleDateChange}
              className="absolute opacity-0 pointer-events-none"
            />
          </>
        )}
      </div>
    </div>
  );
}
