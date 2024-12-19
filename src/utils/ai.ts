import type { DataRow } from '../types';

export const createAnthropicClient = (apiKey: string) => {
  const createMessage = async (content: string, maxTokens: number = 4096) => {
    // Try direct request first with CORS mode
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
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
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.content[0].text;
    } catch (error) {
      console.error('Direct API request failed:', error);
      // Try no-cors mode
      try {
        const noCorsResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
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

        if (!noCorsResponse.ok) {
          throw new Error(`No-CORS request failed: ${noCorsResponse.statusText}`);
        }

        const noCorsResult = await noCorsResponse.json();
        return noCorsResult.content[0].text;
      } catch (noCorsError) {
        console.error('No-CORS request failed:', noCorsError);
        return `I apologize, but I'm currently unable to process your request due to browser security restrictions. This feature works best when running the application locally.

To use this feature:
1. Clone the repository: git clone https://github.com/MarkScrivo/nfl-analytics-dashboard.git
2. Install dependencies: npm install
3. Start the app: npm run dev
4. Use your Anthropic API key

Error details: ${error instanceof Error ? error.message : 'Unknown error'}`;
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
