export const mockInsights = {
  insights: [
    {
      text: "There's a strong correlation between betting line movements and weather conditions. Games with adverse weather conditions show more significant line movements, particularly in the spread and total lines.",
      visualization: {
        type: "scatter",
        x: "spread_bet_pct",
        y: "total",
        title: "Weather Impact on Betting Lines",
        xaxis: "Spread Betting Percentage",
        yaxis: "Total Line"
      }
    },
    {
      text: "Home teams with higher yards per play averages tend to attract more betting action, suggesting that public betting is influenced by offensive performance metrics.",
      visualization: {
        type: "scatter",
        x: "home_yards_per_play",
        y: "spread_bet_pct",
        title: "Home Team Performance vs Betting Action",
        xaxis: "Yards Per Play",
        yaxis: "Spread Betting Percentage"
      }
    },
    {
      text: "Games with high betting percentages on one side (>70%) often show reverse line movement, indicating potential sharp money on the opposite side.",
      visualization: {
        type: "bar",
        x: "spread_bet_pct",
        y: "spread",
        title: "Line Movement vs Betting Percentage",
        xaxis: "Spread Betting Percentage",
        yaxis: "Closing Spread"
      }
    }
  ]
};

export const generateMockResponse = (query: string) => {
  const responses: { [key: string]: string } = {
    default: "Based on the NFL game data analysis, here's what I found...",
    weather: "Weather conditions have a significant impact on game outcomes. Games with adverse weather show lower scoring averages and more volatile betting patterns.",
    performance: "Team performance metrics, especially yards per play and third down conversion rates, show strong correlation with betting line movements.",
    betting: "Betting patterns indicate that public money tends to favor home favorites, while sharp money often takes opposing positions on heavy public sides.",
    trends: "Historical trends show that games with extreme betting percentages (>75% on one side) often result in outcomes favoring the less popular side.",
    stats: "Statistical analysis reveals that home teams with above-average offensive metrics attract approximately 60% of betting action.",
  };

  // Look for keywords in the query and return relevant response
  const keywords = ['weather', 'performance', 'betting', 'trends', 'stats'];
  const matchedKeyword = keywords.find(keyword => query.toLowerCase().includes(keyword));
  
  return responses[matchedKeyword || 'default'];
};
