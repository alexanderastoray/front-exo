/**
 * FormTextarea Component
 * Reusable textarea for forms
 */

interface FormTextareaProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  optional?: boolean;
  rows?: number;
}

export function FormTextarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  optional = false,
  rows = 3,
}: FormTextareaProps) {
  return (
    <div>
      <label
        className="block text-sm font-medium text-foreground-light/80 dark:text-foreground-dark/80 mb-1"
        htmlFor={id}
      >
        {label}{' '}
        {optional && (
          <span className="text-foreground-light/50 dark:text-foreground-dark/50">
            (Optional)
          </span>
        )}
      </label>
      <textarea
        className="w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg p-4 text-foreground-light dark:text-foreground-dark placeholder:text-foreground-light/50 dark:placeholder:text-foreground-dark/50 focus:ring-2 focus:ring-primary"
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
