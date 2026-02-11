/**
 * IconButton Component
 * Button with icon only
 */

interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  ariaLabel: string;
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  icon,
  onClick,
  ariaLabel,
  size = 'md',
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors`}
    >
      <span className="material-symbols-outlined text-primary">{icon}</span>
    </button>
  );
}
