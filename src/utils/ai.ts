import type { DataRow } from '../types';

const isStackBlitz = window.location.hostname.includes('stackblitz.io');

export const createAnthropicClient = (apiKey: string) => {
  const createMessage = async (content: string, maxTokens: number = 4096) => {
    try {
      // Direct API call with CORS headers
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: maxTokens,
          temperature: 0,
          messages: [{
            role: 'user',
            content: [{
              type: 'text',
              text: content
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API request failed:', errorText);
        throw new Error(`Failed to get response from AI: ${response.statusText}`);
      }

      const result = await response.json();
      return result.content[0].text;
    } catch (err) {
      console.error('Error making API request:', err);
      if (isStackBlitz) {
        // Fallback message for StackBlitz environment
        return `Due to CORS restrictions in the StackBlitz environment, the AI features are currently only available when running the application locally. 

To test these features:
1. Clone the repository
2. Run locally with 'npm install && npm run dev'
3. Use your Anthropic API key

Error details: ${err instanceof Error ? err.message : 'Unknown error'}`;
      }
      throw err;
    }
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
