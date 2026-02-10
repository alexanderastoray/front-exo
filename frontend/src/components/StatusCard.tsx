interface StatusCardProps {
  title: string;
  status: 'ok' | 'error' | 'unknown';
  message?: string;
  error?: string;
}

/**
 * Status card component
 * Displays the status of a system component
 */
export default function StatusCard({ title, status, message, error }: StatusCardProps) {
  const statusColors = {
    ok: 'bg-green-100 border-green-500 text-green-900',
    error: 'bg-red-100 border-red-500 text-red-900',
    unknown: 'bg-gray-100 border-gray-500 text-gray-900',
  };

  const statusIcons = {
    ok: '✓',
    error: '✗',
    unknown: '?',
  };

  return (
    <div className={`border-l-4 p-4 rounded ${statusColors[status]}`}>
      <div className="flex items-center">
        <span className="text-2xl mr-3">{statusIcons[status]}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          {message && <p className="text-sm mt-1">{message}</p>}
          {error && <p className="text-sm mt-1 font-mono">{error}</p>}
        </div>
      </div>
    </div>
  );
}
