/**
 * FormInput Component
 * Reusable input field for forms
 */

interface FormInputProps {
  label: string;
  id: string;
  name: string;
  type?: 'text' | 'number' | 'email';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  optional?: boolean;
  prefix?: string;
}

export function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  optional = false,
  prefix,
}: FormInputProps) {
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
      <div className="relative">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-foreground-light/50 dark:text-foreground-dark/50">
              {prefix}
            </span>
          </div>
        )}
        <input
          className={`w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg h-14 ${
            prefix ? 'pl-8' : 'pl-4'
          } pr-4 text-foreground-light dark:text-foreground-dark placeholder:text-foreground-light/50 dark:placeholder:text-foreground-dark/50 focus:ring-2 focus:ring-primary`}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
