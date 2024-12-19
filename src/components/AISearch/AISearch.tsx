import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { DataRow } from '../../types';
import { createAnthropicClient, generateDataQueryPrompt } from '../../utils/ai';

interface AISearchProps {
  data: DataRow[];
  apiKey: string;
}

export const AISearch: React.FC<AISearchProps> = ({ data, apiKey }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const client = createAnthropicClient(apiKey);
      const prompt = generateDataQueryPrompt(data, query);
      const result = await client.createMessage(prompt);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">AI Search</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about the data..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {response && (
          <div className="p-4 bg-gray-50 rounded-md">
            <pre className="whitespace-pre-wrap font-sans">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
