import React from 'react';
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { StatCard } from './StatCard';
import { BarChart } from './Charts/BarChart';
import { PieChart } from './Charts/PieChart';
import type { ColumnStats, DataRow } from '../../types';

interface ColumnStatProps {
  name: string;
  stats: ColumnStats;
  data: DataRow[];
}

export const ColumnStat: React.FC<ColumnStatProps> = ({ name, stats, data }) => {
  const Icon = stats.type === 'numeric' ? BarChartIcon : PieChartIcon;

  return (
    <StatCard title={name} icon={Icon}>
      <div className="space-y-4">
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
        
        {stats.type === 'numeric' ? (
          <BarChart data={data} column={name} stats={stats} />
        ) : (
          <PieChart data={data} column={name} stats={stats} />
        )}
      </div>
    </StatCard>
  );
};