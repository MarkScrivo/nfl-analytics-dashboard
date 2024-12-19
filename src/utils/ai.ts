import type { DataRow } from '../types';

export const createAnthropicClient = (apiKey: string) => {
  const createMessage = async (content: string, maxTokens: number = 4096) => {
    // Use a proxy that's specifically designed for API requests
    const proxyUrl = 'https://api.allorigins.win/raw';
    const targetUrl = 'https://api.anthropic.com/v1/messages';
    
    try {
      const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(targetUrl)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Origin': 'null',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
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
    } catch (error) {
      console.error('Error making API request:', error);
      // Try alternative approach
      try {
        const formData = new FormData();
        formData.append('url', targetUrl);
        formData.append('method', 'POST');
        formData.append('headers', JSON.stringify({
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }));
        formData.append('data', JSON.stringify({
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
        }));

        const altResponse = await fetch('https://api.allorigins.win/proxy', {
          method: 'POST',
          body: formData
        });

        if (!altResponse.ok) {
          throw new Error(`Alternative approach failed: ${altResponse.statusText}`);
        }

        const altResult = await altResponse.json();
        return altResult.content[0].text;
      } catch (altError) {
        console.error('Alternative approach also failed:', altError);
        throw error; // Throw original error if both attempts fail
      }
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
