import React from 'react';
import Plot from 'react-plotly.js';
import { getColumnValues } from '../../../utils/charts';
import type { ColumnStats } from '../../../types';

interface PieChartProps {
  data: { [key: string]: number | string }[];
  column: string;
  stats: ColumnStats;
}

export const PieChart: React.FC<PieChartProps> = ({ data, column, stats }) => {
  const values = getColumnValues(data, column);
  
  // Only show pie chart for string columns with reasonable number of unique values
  if (stats.type !== 'string' || stats.uniqueValues > 10) {
    return null;
  }

  // Count occurrences of each value
  const valueCounts = values.reduce((acc: { [key: string]: number }, value) => {
    const key = String(value);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sortedEntries = Object.entries(valueCounts)
    .sort((a, b) => b[1] - a[1]);

  return (
    <Plot
      data={[
        {
          type: 'pie',
          labels: sortedEntries.map(([label]) => label),
          values: sortedEntries.map(([, count]) => count),
          textinfo: 'label+percent',
          hoverinfo: 'label+value+percent',
          marker: {
            colors: [
              'rgb(59, 130, 246)',   // blue
              'rgb(16, 185, 129)',   // green
              'rgb(239, 68, 68)',    // red
              'rgb(245, 158, 11)',   // yellow
              'rgb(139, 92, 246)',   // purple
              'rgb(236, 72, 153)',   // pink
              'rgb(14, 165, 233)',   // light blue
              'rgb(168, 85, 247)',   // violet
              'rgb(249, 115, 22)',   // orange
              'rgb(59, 130, 246)',   // blue
            ],
          },
        },
      ]}
      layout={{
        title: `Distribution of ${column}`,
        margin: { t: 30, r: 10, b: 10, l: 10 },
        height: 300,
        paper_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        font: {
          family: 'Inter, sans-serif',
        },
      }}
      config={{ responsive: true }}
      className="w-full"
    />
  );
};
