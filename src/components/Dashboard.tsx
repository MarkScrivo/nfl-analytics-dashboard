import React from 'react';
import { BarChart, PieChart, Table } from 'lucide-react';
import { AnalyticsResult } from '../types';

interface DashboardProps {
  analytics: AnalyticsResult;
}

export const Dashboard: React.FC<DashboardProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Summary Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Data Summary</h3>
          <Table className="w-6 h-6 text-blue-500" />
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">Rows: {analytics.rowCount}</p>
          <p className="text-gray-600">Columns: {analytics.columnCount}</p>
        </div>
      </div>

      {/* Column Statistics */}
      {Object.entries(analytics.columnStats).map(([column, stats]) => (
        <div key={column} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{column}</h3>
            {stats.type === 'numeric' ? (
              <BarChart className="w-6 h-6 text-blue-500" />
            ) : (
              <PieChart className="w-6 h-6 text-blue-500" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Type: {stats.type}</p>
            {stats.type === 'numeric' && (
              <>
                <p className="text-gray-600">Average: {stats.average?.toFixed(2)}</p>
                <p className="text-gray-600">Max: {stats.max}</p>
                <p className="text-gray-600">Min: {stats.min}</p>
              </>
            )}
            <p className="text-gray-600">Unique Values: {stats.uniqueValues}</p>
          </div>
        </div>
      ))}
    </div>
  );
};