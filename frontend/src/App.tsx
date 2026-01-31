import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Check required environment variables
const ENV_ERRORS: string[] = [];
if (!API_BASE_URL) {
  ENV_ERRORS.push("VITE_API_BASE_URL is not set");
}

interface HealthResponse {
  status: string;
}

interface HelloResponse {
  message: string;
}

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [helloMessage, setHelloMessage] = useState<HelloResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetching if env vars are missing
    if (ENV_ERRORS.length > 0) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch health status
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        if (!healthResponse.ok) throw new Error("Health check failed");
        const healthData: HealthResponse = await healthResponse.json();
        setHealthStatus(healthData);

        // Fetch hello message
        const helloResponse = await fetch(`${API_BASE_URL}/hello`);
        if (!helloResponse.ok) throw new Error("Hello request failed");
        const helloData: HelloResponse = await helloResponse.json();
        setHelloMessage(helloData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show environment configuration error
  if (ENV_ERRORS.length > 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        <header className="bg-red-700 text-white p-8 text-center">
          <h1 className="m-0 text-4xl font-bold">ASCENT</h1>
          <p className="mt-2 opacity-80">Configuration Error</p>
        </header>

        <main className="flex-1 p-8 flex justify-center items-start">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full">
            <h2 className="mb-6 text-red-700 text-xl font-semibold">
              Missing Environment Variables
            </h2>
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <ul className="list-disc list-inside text-red-600 space-y-2">
                {ENV_ERRORS.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                Please set the required environment variables in your
                docker-compose.yml or .env file.
              </p>
            </div>
          </div>
        </main>

        <footer className="bg-red-700 text-white p-4 text-center text-sm opacity-80">
          <p>Frontend: localhost:5173</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-slate-900 text-white p-8 text-center">
        <h1 className="m-0 text-4xl font-bold">ASCENT</h1>
        <p className="mt-2 opacity-80">Development Environment</p>
      </header>

      <main className="flex-1 p-8 flex justify-center items-start">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full">
          <h2 className="mb-6 text-slate-900 text-xl font-semibold">
            API Status
          </h2>

          {loading && <p className="text-gray-500 text-center">Loading...</p>}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">
              <p>Error: {error}</p>
              <p className="text-sm text-gray-500 mt-2">
                Make sure the backend is running on port 9090
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium mb-2">GET /health</h3>
                <pre className="bg-gray-50 border border-gray-200 rounded p-4 overflow-auto text-sm">
                  {JSON.stringify(healthStatus, null, 2)}
                </pre>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium mb-2">GET /hello</h3>
                <pre className="bg-gray-50 border border-gray-200 rounded p-4 overflow-auto text-sm">
                  {JSON.stringify(helloMessage, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-900 text-white p-4 text-center text-sm opacity-80">
        <p>Frontend: localhost:5173 | Backend: localhost:9090</p>
      </footer>
    </div>
  );
}

export default App;
