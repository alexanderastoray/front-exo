/**
 * FilterPill Component
 * Displays active filter as a removable pill
 */

interface FilterPillProps {
  label: string;
  onRemove: () => void;
}

export function FilterPill({ label, onRemove }: FilterPillProps) {
  return (
    <div className="flex items-center gap-1 bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="text-white/80 hover:text-white transition-colors"
        aria-label="Remove filter"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}
