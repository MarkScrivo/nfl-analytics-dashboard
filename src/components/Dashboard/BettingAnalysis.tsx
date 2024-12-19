import React from 'react';
import Plot from 'react-plotly.js';
import { getNumericValues } from '../../utils/charts';
import type { DataRow } from '../../types';

interface BettingAnalysisProps {
  data: DataRow[];
}

interface LineMovement {
  game: string;
  movement: number;
  spreadBetPct: number;
  totalBetPct: number;
  mlBetPct: number;
  weather: string;
  homeYPP: number;
  awayYPP: number;
  date: string;
}

export const BettingAnalysis: React.FC<BettingAnalysisProps> = ({ data }) => {
  // Calculate line movement (closing vs opening spread)
  const lineMovements: LineMovement[] = data.map(row => ({
    game: `${row.home_team} vs ${row.away_team}`,
    movement: Number(row.spread) - Number(row.opening_spread),
    spreadBetPct: Number(row.spread_bet_pct),
    totalBetPct: Number(row.total_bet_pct),
    mlBetPct: Number(row.ml_bet_pct),
    weather: String(row.weather).split(',')[0].trim(),
    homeYPP: Number(row.home_yards_per_play),
    awayYPP: Number(row.away_yards_per_play),
    date: String(row.date)
  }));

  // Sort by absolute line movement to find biggest movers
  const sortedByMovement = [...lineMovements].sort((a, b) => 
    Math.abs(b.movement) - Math.abs(a.movement)
  ).slice(0, 5); // Top 5 movements

  // Calculate betting percentage anomalies
  const avgSpreadBetPct = lineMovements.reduce((sum, row) => sum + row.spreadBetPct, 0) / lineMovements.length;
  const stdDevSpreadBet = Math.sqrt(
    lineMovements.reduce((sum, row) => 
      sum + Math.pow(row.spreadBetPct - avgSpreadBetPct, 2), 0
    ) / lineMovements.length
  );

  return (
    <div className="space-y-8 w-full">
      {/* Significant Line Movements */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Significant Line Movements</h2>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spread Bet %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weather</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedByMovement.map((row, i) => (
                <tr key={i} className={Math.abs(row.movement) > 3 ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.game}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.movement.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.spreadBetPct}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.weather}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Line Movement Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Line Movement Analysis</h2>
        <div className="w-full">
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'markers',
                x: lineMovements.map(d => d.spreadBetPct),
                y: lineMovements.map(d => d.movement),
                marker: {
                  color: lineMovements.map(d => Math.abs(d.movement)),
                  colorscale: 'RdYlBu',
                  size: 10,
                  showscale: true,
                  colorbar: { title: 'Absolute Movement' }
                },
                text: lineMovements.map(d => 
                  `${d.game}<br>Date: ${d.date}<br>Movement: ${d.movement.toFixed(2)}<br>Spread Bet %: ${d.spreadBetPct}%`
                ),
                hovertemplate: '%{text}<extra></extra>'
              }
            ]}
            layout={{
              title: 'Line Movement vs Betting Percentage',
              xaxis: { title: 'Spread Bet %' },
              yaxis: { title: 'Line Movement (Close - Open)' },
              height: 500,
              width: undefined,
              autosize: true,
              showlegend: false,
              margin: { l: 50, r: 30, t: 50, b: 50 }
            }}
            config={{ 
              responsive: true,
              displayModeBar: true,
              displaylogo: false
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>

      {/* Betting Percentage Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Betting Distribution Analysis</h2>
        <div className="w-full">
          <Plot
            data={[
              {
                type: 'violin',
                x: ['Spread', 'Total', 'Money Line'],
                y: [
                  ...getNumericValues(data, 'spread_bet_pct'),
                  ...getNumericValues(data, 'total_bet_pct'),
                  ...getNumericValues(data, 'ml_bet_pct')
                ],
                points: 'all',
                box: { visible: true },
                line: { color: 'blue' },
                meanline: { visible: true },
                name: 'Distribution'
              }
            ]}
            layout={{
              title: 'Betting Percentage Distribution by Type',
              yaxis: { title: 'Betting Percentage' },
              height: 500,
              width: undefined,
              autosize: true,
              showlegend: false,
              margin: { l: 50, r: 30, t: 50, b: 50 }
            }}
            config={{ 
              responsive: true,
              displayModeBar: true,
              displaylogo: false
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>

      {/* Performance vs Betting Correlation */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Performance vs Betting Analysis</h2>
        <div className="w-full">
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'markers',
                x: lineMovements.map(d => (d.homeYPP + d.awayYPP) / 2),
                y: lineMovements.map(d => d.spreadBetPct),
                marker: {
                  color: lineMovements.map(d => d.movement),
                  colorscale: 'RdYlBu',
                  size: 10,
                  showscale: true,
                  colorbar: { title: 'Line Movement' }
                },
                text: lineMovements.map(d => 
                  `${d.game}<br>Date: ${d.date}<br>Avg YPP: ${((d.homeYPP + d.awayYPP) / 2).toFixed(2)}<br>Spread Bet %: ${d.spreadBetPct}%`
                ),
                hovertemplate: '%{text}<extra></extra>'
              }
            ]}
            layout={{
              title: 'Performance vs Betting Percentage',
              xaxis: { title: 'Average Yards Per Play' },
              yaxis: { title: 'Spread Bet %' },
              height: 500,
              width: undefined,
              autosize: true,
              showlegend: false,
              margin: { l: 50, r: 30, t: 50, b: 50 }
            }}
            config={{ 
              responsive: true,
              displayModeBar: true,
              displaylogo: false
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Betting Anomaly Detection</h2>
        <div className="w-full">
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'markers',
                x: lineMovements.map(d => d.date),
                y: lineMovements.map(d => d.spreadBetPct),
                marker: {
                  color: lineMovements.map(d => 
                    Math.abs(d.spreadBetPct - avgSpreadBetPct) > 2 * stdDevSpreadBet ? 'red' : 'blue'
                  ),
                  size: lineMovements.map(d => 
                    Math.abs(d.spreadBetPct - avgSpreadBetPct) > 2 * stdDevSpreadBet ? 12 : 8
                  ),
                },
                text: lineMovements.map(d => 
                  `${d.game}<br>Date: ${d.date}<br>Spread Bet %: ${d.spreadBetPct}%<br>Weather: ${d.weather}`
                ),
                hovertemplate: '%{text}<extra></extra>'
              },
              {
                type: 'scatter',
                mode: 'lines',
                x: lineMovements.map(d => d.date),
                y: Array(lineMovements.length).fill(avgSpreadBetPct),
                line: { color: 'gray', dash: 'dash' },
                name: 'Average'
              }
            ]}
            layout={{
              title: 'Betting Percentage Anomalies Over Time',
              xaxis: { title: 'Date' },
              yaxis: { title: 'Spread Bet %' },
              height: 500,
              width: undefined,
              autosize: true,
              showlegend: false,
              margin: { l: 50, r: 30, t: 50, b: 50 },
              annotations: [
                {
                  x: 0.5,
                  y: 1.1,
                  xref: 'paper',
                  yref: 'paper',
                  text: 'Red points indicate anomalies (>2 standard deviations from mean)',
                  showarrow: false,
                  font: { size: 12 }
                }
              ]
            }}
            config={{ 
              responsive: true,
              displayModeBar: true,
              displaylogo: false
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>
    </div>
  );
};
