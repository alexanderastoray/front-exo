import { useHealth } from '../hooks/useHealth';
import StatusCard from '../components/StatusCard';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Status page component
 * Displays the health status of the backend system
 */
export default function StatusPage() {
  const { health, loading, error, refetch } = useHealth();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">System Status</h1>
          <button
            onClick={refetch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading && !health && <LoadingSpinner />}

        {error && (
          <StatusCard
            title="Connection Error"
            status="error"
            message="Unable to connect to the backend API"
            error={error}
          />
        )}

        {health && (
          <div className="space-y-4">
            <StatusCard
              title="Overall Status"
              status={health.ok ? 'ok' : 'error'}
              message={health.message}
            />

            <StatusCard
              title="API Service"
              status={health.api.ok ? 'ok' : 'error'}
              message={health.api.ok ? 'API is responding' : 'API is not responding'}
            />

            <StatusCard
              title="Database"
              status={health.db.ok ? 'ok' : 'error'}
              message={health.db.ok ? 'Database is connected' : 'Database connection failed'}
              error={health.db.error}
            />

            <div className="mt-6 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                Last checked: {new Date(health.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
