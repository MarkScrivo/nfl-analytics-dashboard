import React, { useState, useCallback } from 'react';
import { LineChart } from 'lucide-react';
import { FileUpload } from './components/FileUpload/FileUpload';
import { Dashboard } from './components/Dashboard/Dashboard';
import { analyzeData } from './utils/analytics';
import type { DataRow, AnalyticsResult } from './types';

function App() {
  const [data, setData] = useState<DataRow[] | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = useCallback((uploadedData: DataRow[]) => {
    console.log('Received data:', uploadedData.length, 'rows');
    console.log('First row:', uploadedData[0]);
    
    setIsLoading(true);
    setError(null);

    try {
      // Validate data
      if (!uploadedData || uploadedData.length === 0) {
        throw new Error('No data provided');
      }

      // Update data state
      setData(uploadedData);
      console.log('Data state updated');
      
      // Process analytics
      const result = analyzeData(uploadedData);
      console.log('Analytics processed:', result);
      
      // Update analytics state
      setAnalytics(result);
      console.log('Analytics state updated');
      
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while processing the data');
      setData(null);
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <LineChart className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">NFL Analytics Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Processing data...</p>
            </div>
          </div>
        ) : !data || !analytics ? (
          <div className="max-w-xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="w-full">
            <Dashboard data={data} analytics={analytics} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
