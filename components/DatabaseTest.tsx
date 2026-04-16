'use client';

import { useState } from 'react';

interface DatabaseResult {
  success: boolean;
  message?: string;
  collections?: string[];
  details?: Record<string, any>;
  error?: string;
  stack?: string;
}

export default function DatabaseTest() {
  const [result, setResult] = useState<DatabaseResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test de Base de Données MongoDB</h1>

      <button
        onClick={testDatabase}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Tester la connexion MongoDB'}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-4">
            Résultat: {result.success ? '✅ Succès' : '❌ Échec'}
          </h2>

          {result.success ? (
            <div>
              <p className="text-green-600 mb-4">{result.message}</p>

              <div className="mb-4">
                <h3 className="font-semibold">Collections trouvées:</h3>
                <ul className="list-disc list-inside">
                  {result.collections?.map(collection => (
                    <li key={collection}>{collection}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Détails des collections:</h3>
                {Object.entries(result.details || {}).map(([collection, info]) => (
                  <div key={collection} className="mb-4 p-3 bg-gray-50 rounded">
                    <h4 className="font-medium">{collection}</h4>
                    <p>Status: {info.status}</p>
                    <p>Nombre de documents: {info.count || 'N/A'}</p>
                    {info.sample && (
                      <details className="mt-2">
                        <summary className="cursor-pointer">Voir un exemple</summary>
                        <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(info.sample, null, 2)}
                        </pre>
                      </details>
                    )}
                    {info.error && (
                      <p className="text-red-600">Erreur: {info.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-red-600">
              <p>Erreur: {result.error}</p>
              {result.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Voir le stack trace</summary>
                  <pre className="text-xs mt-2 bg-red-50 p-2 rounded overflow-auto">
                    {result.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}