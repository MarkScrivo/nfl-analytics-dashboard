import React from 'react';
import Plot from 'react-plotly.js';
import { getColumnValues } from '../../../utils/charts';
import type { ColumnStats } from '../../../types';

interface BarChartProps {
  data: { [key: string]: number | string }[];
  column: string;
  stats: ColumnStats;
}

export const BarChart: React.FC<BarChartProps> = ({ data, column, stats }) => {
  const values = getColumnValues(data, column);
  
  // For numeric columns, create a histogram
  if (stats.type === 'numeric' && typeof stats.max === 'number' && typeof stats.min === 'number') {
    const numericValues = values.filter((v): v is number => typeof v === 'number');
    
    return (
      <Plot
        data={[
          {
            type: 'histogram',
            x: numericValues,
            marker: {
              color: 'rgb(59, 130, 246)',
              opacity: 0.7,
            },
            autobinx: false,
            xbins: {
              size: (stats.max - stats.min) / 20,
              start: stats.min,
              end: stats.max,
            },
          },
        ]}
        layout={{
          title: `Distribution of ${column}`,
          xaxis: { title: column },
          yaxis: { title: 'Count' },
          margin: { t: 30, r: 10, b: 40, l: 40 },
          height: 300,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: {
            family: 'Inter, sans-serif',
          },
          bargap: 0.1,
        }}
        config={{ responsive: true }}
        className="w-full"
      />
    );
  }

  // For string columns, count occurrences of each value
  const valueCounts = values.reduce((acc: { [key: string]: number }, value) => {
    const key = String(value);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sortedEntries = Object.entries(valueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Show top 10 values

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: sortedEntries.map(([label]) => label),
          y: sortedEntries.map(([, count]) => count),
          marker: {
            color: 'rgb(59, 130, 246)',
            opacity: 0.7,
          },
        },
      ]}
      layout={{
        title: `Top Values in ${column}`,
        xaxis: { 
          title: column,
          tickangle: -45,
        },
        yaxis: { title: 'Count' },
        margin: { t: 30, r: 10, b: 100, l: 40 },
        height: 300,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
          family: 'Inter, sans-serif',
        },
        bargap: 0.3,
      }}
      config={{ responsive: true }}
      className="w-full"
    />
  );
};
