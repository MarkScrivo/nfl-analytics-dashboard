import type { DataRow } from '../types';

export const createAnthropicClient = (apiKey: string) => {
  const createMessage = async (content: string, maxTokens: number = 4096) => {
    // Use a combination of proxies and try them in sequence
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/',
      'https://cors-anywhere.herokuapp.com/'
    ];

    let lastError = null;

    // Try each proxy in sequence until one works
    for (const proxy of proxies) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent('https://api.anthropic.com/v1/messages')}`;
        
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

        if (response.ok) {
          const result = await response.json();
          return result.content[0].text;
        }

        lastError = await response.text();
      } catch (error) {
        console.error(`Error with proxy ${proxy}:`, error);
        lastError = error;
        continue; // Try next proxy
      }
    }

    // If we get here, all proxies failed
    console.error('All proxies failed. Last error:', lastError);
    throw new Error('Failed to get response from AI: All proxies failed');
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
