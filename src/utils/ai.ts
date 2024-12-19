import type { DataRow } from '../types';

export const createAnthropicClient = (apiKey: string) => {
  const baseUrl = 'http://localhost:3001/api/anthropic';

  const createMessage = async (content: string, maxTokens: number = 4096) => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey,
        content,
        maxTokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API request failed:', errorText);
      throw new Error(`Failed to get response from AI: ${response.statusText}`);
    }

    const result = await response.json();
    return result.content[0].text;
  };

  return { createMessage };
};

export const generateDataInsightPrompt = (data: DataRow[]) => `
Analyze this NFL game data and generate 3-5 key insights with visualizations.

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

export const generateDataQueryPrompt = (data: DataRow[], query: string) => `
Analyze this NFL game data and answer the following question: ${query}

Data sample (first few rows):
${JSON.stringify(data.slice(0, 3), null, 2)}

Total games in dataset: ${data.length}

Please provide a clear, concise answer based on the data.
`;
