import type { DataRow } from '../types';

export const createAnthropicClient = (apiKey: string) => {
  const createMessage = async (content: string, maxTokens: number = 4096) => {
    // Use a proxy that's specifically designed for API requests
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.anthropic.com/v1/messages');
    
    try {
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Origin': 'null',
          'X-Requested-With': 'XMLHttpRequest'
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

      const proxyResponse = await response.json();
      if (!proxyResponse.contents) {
        throw new Error('Invalid proxy response');
      }

      const result = JSON.parse(proxyResponse.contents);
      return result.content[0].text;
    } catch (error) {
      console.error('Error making API request:', error);
      // Try direct request as fallback
      try {
        const directResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
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

        if (!directResponse.ok) {
          throw new Error(`Direct request failed: ${directResponse.statusText}`);
        }

        const directResult = await directResponse.json();
        return directResult.content[0].text;
      } catch (directError) {
        console.error('Direct request also failed:', directError);
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
