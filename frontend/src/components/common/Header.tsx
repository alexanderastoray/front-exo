/**
 * Header Component
 * Page header with back button and title
 */

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export function Header({ title, onBack }: HeaderProps) {
  return (
    <header className="flex items-center p-4 border-b border-black/5 dark:border-white/10">
      {onBack && (
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-foreground-light dark:text-foreground-dark hover:text-primary transition-colors"
          aria-label="Go back"
        >
          <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 256 256"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </button>
      )}
      <h1 className="text-xl font-bold text-center flex-1 text-foreground-light dark:text-foreground-dark">
        {title}
      </h1>
      {onBack && <div className="w-8"></div>}
    </header>
  );
}
