import React from 'react';
import Plot from 'react-plotly.js';
import { getNumericValues, getCorrelation } from '../../../utils/charts';
import type { ColumnStats } from '../../../types';

interface ScatterPlotProps {
  data: { [key: string]: number | string }[];
  xColumn: string;
  yColumn: string;
  xStats: ColumnStats;
  yStats: ColumnStats;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  xColumn,
  yColumn,
  xStats,
  yStats,
}) => {
  if (xStats.type !== 'numeric' || yStats.type !== 'numeric') return null;

  const xValues = getNumericValues(data, xColumn);
  const yValues = getNumericValues(data, yColumn);
  const correlation = getCorrelation(xValues, yValues);

  return (
    <Plot
      data={[
        {
          type: 'scatter',
          mode: 'markers',
          x: xValues,
          y: yValues,
          marker: {
            color: 'rgb(59, 130, 246)',
            opacity: 0.6,
            size: 8,
          },
          hovertemplate: `${xColumn}: %{x}<br>${yColumn}: %{y}<extra></extra>`,
        },
      ]}
      layout={{
        title: {
          text: `${xColumn} vs ${yColumn}<br>Correlation: ${correlation.toFixed(3)}`,
          font: { size: 14 }
        },
        xaxis: { 
          title: xColumn,
          showgrid: true,
          gridcolor: 'rgb(243, 244, 246)'
        },
        yaxis: { 
          title: yColumn,
          showgrid: true,
          gridcolor: 'rgb(243, 244, 246)'
        },
        margin: { t: 40, r: 10, b: 40, l: 60 },
        height: 300,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
          family: 'Inter, sans-serif',
        },
        showlegend: false,
      }}
      config={{ 
        responsive: true,
        displayModeBar: false
      }}
      className="w-full"
    />
  );
};
