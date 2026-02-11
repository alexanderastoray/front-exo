/**
 * Footer Component
 * Bottom navigation bar
 */

interface FooterProps {
  activeTab?: 'reports' | 'submit' | 'profile';
  onNavigateToReports?: () => void;
  onNavigateToSubmit?: () => void;
  onNavigateToProfile?: () => void;
}

export function Footer({
  activeTab = 'reports',
  onNavigateToReports,
  onNavigateToSubmit,
  onNavigateToProfile,
}: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-background-dark/80 backdrop-blur-sm border-t border-black/5 dark:border-white/10">
      <nav className="flex justify-around items-center h-16">
        <button
          onClick={onNavigateToReports}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'reports'
              ? 'text-primary'
              : 'text-muted-light dark:text-muted-dark hover:text-primary transition-colors'
          }`}
        >
          <svg
            className="text-current"
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 21V3h14v18l-7-3-7 3z"></path>
          </svg>
          <span className="text-xs font-medium">Reports</span>
        </button>

        <button
          onClick={onNavigateToSubmit}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'submit'
              ? 'text-primary'
              : 'text-muted-light dark:text-muted-dark hover:text-primary transition-colors'
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          <span className="text-xs font-medium">Submit</span>
        </button>

        <button
          onClick={onNavigateToProfile}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'profile'
              ? 'text-primary'
              : 'text-muted-light dark:text-muted-dark hover:text-primary transition-colors'
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </nav>
    </footer>
  );
}
