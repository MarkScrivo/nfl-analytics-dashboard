import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import Plot from 'react-plotly.js';
import { getNumericValues } from '../../utils/charts';
import { createAnthropicClient } from '../../utils/ai';
import type { DataRow, Insight, CustomPlotData, AIResponse } from '../../types';

interface AIInsightsProps {
  data: DataRow[];
  apiKey: string;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ data, apiKey }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const client = createAnthropicClient(apiKey);
      const insightPrompt = `
        Analyze this NFL game data and generate insights based on this request: ${prompt}

        Data sample (first few rows):
        ${JSON.stringify(data.slice(0, 3), null, 2)}

        Total games in dataset: ${data.length}

        For each insight, provide:
        1. A clear explanation of the finding
        2. A visualization specification in this format:
        {
          type: "scatter" or "bar" or "box",
          x: [column to use for x-axis],
          y: [column to use for y-axis],
          title: "Chart title",
          xaxis: "X-axis label",
          yaxis: "Y-axis label"
        }

        Format your response as JSON with this structure:
        {
          "insights": [
            {
              "text": "Insight explanation",
              "visualization": {visualization specification}
            }
          ]
        }
      `;

      const result = await client.createMessage(insightPrompt);
      const parsedInsights: AIResponse = JSON.parse(result);
      setInsights(parsedInsights.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderVisualization = (viz: Insight['visualization']) => {
    if (!viz) return null;

    const getPlotData = (): CustomPlotData[] => {
      const x = getNumericValues(data, viz.x);
      const y = getNumericValues(data, viz.y);

      return [{
        type: viz.type,
        x,
        y,
        mode: viz.type === 'scatter' ? 'markers' : undefined,
        marker: {
          color: viz.type === 'scatter' ? getNumericValues(data, 'home_yards_per_play') : undefined,
          colorscale: viz.type === 'scatter' ? 'RdYlBu' : undefined,
          showscale: viz.type === 'scatter',
          size: 10
        }
      }];
    };

    return (
      <Plot
        data={getPlotData()}
        layout={{
          title: viz.title,
          xaxis: { title: viz.xaxis },
          yaxis: { title: viz.yaxis },
          height: 400,
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
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">AI Insights</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What insights would you like to generate? (e.g., 'Show me trends in home team performance')"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={generateInsights}
              disabled={isLoading || !prompt.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Lightbulb className="w-5 h-5" />
                  <span>Generate Insights</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-md">
              <p className="text-gray-900 mb-4">{insight.text}</p>
              {insight.visualization && (
                <div className="mt-4">
                  {renderVisualization(insight.visualization)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
