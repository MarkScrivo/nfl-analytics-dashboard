import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { getNumericValues, formatDate } from '../../utils/charts';
import { BettingAnalysis } from './BettingAnalysis';
import { AISearch } from '../AISearch/AISearch';
import { AIInsights } from '../AIInsights/AIInsights';
import type { AnalyticsResult, DataRow } from '../../types';

interface DashboardProps {
  analytics: AnalyticsResult;
  data: DataRow[];
}

type TabType = 'performance' | 'betting' | 'ai-search' | 'ai-insights';

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [selectedTeam, setSelectedTeam] = useState<string>('All Teams');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('performance');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const teams = useMemo(() => {
    const teamSet = new Set<string>();
    data.forEach(row => {
      if (typeof row.home_team === 'string') teamSet.add(row.home_team);
      if (typeof row.away_team === 'string') teamSet.add(row.away_team);
    });
    return ['All Teams', ...Array.from(teamSet).sort()];
  }, [data]);

  const dates = useMemo(() => {
    return Array.from(new Set(
      data.map(row => formatDate(String(row.date)))
    )).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const teamMatch = selectedTeam === 'All Teams' || 
        row.home_team === selectedTeam || 
        row.away_team === selectedTeam;
      const dateMatch = !selectedDate || formatDate(String(row.date)) === selectedDate;
      return teamMatch && dateMatch;
    });
  }, [data, selectedTeam, selectedDate]);

  const averages = useMemo(() => {
    if (filteredData.length === 0) return null;
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      homePassingYards: avg(getNumericValues(filteredData, 'home_passing_yards')),
      homeRushingYards: avg(getNumericValues(filteredData, 'home_rushing_yards')),
      awayPassingYards: avg(getNumericValues(filteredData, 'away_passing_yards')),
      awayRushingYards: avg(getNumericValues(filteredData, 'away_rushing_yards')),
      homeYPP: avg(getNumericValues(filteredData, 'home_yards_per_play')),
      awayYPP: avg(getNumericValues(filteredData, 'away_yards_per_play')),
      thirdDownConversion: avg(getNumericValues(filteredData, 'home_third_down_conversions')
        .concat(getNumericValues(filteredData, 'away_third_down_conversions')))
    };
  }, [filteredData]);

  if (!averages) return <div>No data available for the selected filters</div>;

  const renderTabButton = (tab: TabType, label: string) => (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-md ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
      onClick={() => {
        if ((tab === 'ai-search' || tab === 'ai-insights') && !apiKey) {
          setShowApiKeyInput(true);
        } else {
          setActiveTab(tab);
        }
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-[2000px] mx-auto">
      {/* API Key Input Modal */}
      {showApiKeyInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Enter Anthropic API Key</h3>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-api-key..."
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (apiKey) {
                    setShowApiKeyInput(false);
                    setActiveTab(activeTab === 'ai-search' ? 'ai-search' : 'ai-insights');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!apiKey}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-wrap gap-2">
            {renderTabButton('performance', 'Performance')}
            {renderTabButton('betting', 'Betting Analysis')}
            {renderTabButton('ai-search', 'AI Search')}
            {renderTabButton('ai-insights', 'AI Insights')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Team</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
              >
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              >
                <option value="">All Dates</option>
                {dates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Avg Home Passing/Rushing</h3>
          <p className="mt-1 text-xl font-semibold">
            {averages.homePassingYards.toFixed(1)} / {averages.homeRushingYards.toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Avg Away Passing/Rushing</h3>
          <p className="mt-1 text-xl font-semibold">
            {averages.awayPassingYards.toFixed(1)} / {averages.awayRushingYards.toFixed(1)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Avg Yards Per Play (Home/Away)</h3>
          <p className="mt-1 text-xl font-semibold">
            {averages.homeYPP.toFixed(2)} / {averages.awayYPP.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Avg 3rd Down Conversions</h3>
          <p className="mt-1 text-xl font-semibold">
            {averages.thirdDownConversion.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'performance' && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold mb-4">Offensive Performance</h2>
          <div className="w-full" style={{ minHeight: '500px' }}>
            <Plot
              data={[
                {
                  type: 'scatter',
                  mode: 'markers',
                  name: 'Home Teams',
                  x: getNumericValues(filteredData, 'home_passing_yards'),
                  y: getNumericValues(filteredData, 'home_rushing_yards'),
                  marker: { 
                    color: getNumericValues(filteredData, 'home_yards_per_play'),
                    colorscale: 'RdYlBu',
                    showscale: true,
                    size: 12,
                    colorbar: { title: 'Yards Per Play' }
                  },
                  text: filteredData.map(row => `${row.home_team}<br>YPP: ${row.home_yards_per_play}`),
                  hovertemplate: '%{text}<br>Passing: %{x}<br>Rushing: %{y}'
                }
              ]}
              layout={{
                title: 'Passing vs Rushing Yards (Color = Yards Per Play)',
                xaxis: { title: 'Passing Yards' },
                yaxis: { title: 'Rushing Yards' },
                height: 500,
                width: undefined,
                autosize: true,
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
      )}

      {activeTab === 'betting' && (
        <BettingAnalysis data={filteredData} />
      )}

      {activeTab === 'ai-search' && apiKey && (
        <AISearch data={filteredData} apiKey={apiKey} />
      )}

      {activeTab === 'ai-insights' && apiKey && (
        <AIInsights data={filteredData} apiKey={apiKey} />
      )}
    </div>
  );
};
