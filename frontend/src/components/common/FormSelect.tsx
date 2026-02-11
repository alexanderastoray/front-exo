/**
 * FormSelect Component
 * Reusable select dropdown for forms
 */

interface FormSelectProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

export function FormSelect({
  label,
  id,
  name,
  value,
  onChange,
  options,
}: FormSelectProps) {
  return (
    <div>
      <label
        className="block text-sm font-medium text-foreground-light/80 dark:text-foreground-dark/80 mb-1"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        className="w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg h-14 px-4 pr-10 text-foreground-light dark:text-foreground-dark focus:ring-2 focus:ring-primary appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
