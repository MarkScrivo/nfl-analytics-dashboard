# NFL Analytics Dashboard

A React-based dashboard for analyzing NFL game data with AI-powered insights and betting trend analysis.

## Features

- CSV data upload and parsing
- Interactive visualizations using Plotly
- Betting trend analysis
- Performance metrics visualization
- Weather impact analysis
- Anomaly detection in betting patterns
- AI-powered features:
  - Custom insight generation
  - Natural language queries
  - Automated visualization creation

## Important Note About AI Features

Due to CORS restrictions:
- AI features (Search and Insights) are fully functional when running the application locally
- In the StackBlitz environment, these features will display a message explaining the limitation
- To use AI features, please clone and run the project locally

## Getting Started

### Local Development (Recommended for Full Features)

1. Clone the repository:
```bash
git clone https://github.com/MarkScrivo/nfl-analytics-dashboard.git
cd nfl-analytics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### StackBlitz Demo

You can view a demo version on StackBlitz:
[Open in StackBlitz](https://stackblitz.com/github/MarkScrivo/nfl-analytics-dashboard)

Note: AI features require local development environment.

## Using AI Features (Local Development)

1. Get an API key from Anthropic:
   - Visit https://console.anthropic.com/
   - Create an account and generate an API key

2. Using AI Search:
   - Click the "AI Search" tab
   - Enter your Anthropic API key
   - Ask questions about the data in natural language
   - Get AI-powered answers based on the analysis

3. Using AI Insights:
   - Click the "AI Insights" tab
   - Enter your Anthropic API key
   - Type your specific insight request (e.g., "Show me trends in home team performance")
   - Get AI-generated insights with visualizations

Example prompts for AI Insights:
- "Analyze betting patterns for games with high spreads"
- "Find correlations between weather conditions and scoring"
- "Identify unusual betting line movements"
- "Show performance trends for specific teams"

## Data Format

The dashboard expects CSV files with the following columns:

- date
- season_type
- home_team
- away_team
- weather
- spread
- total
- home_ml
- away_ml
- opening_spread
- opening_total
- spread_bet_pct
- total_bet_pct
- ml_bet_pct
- Various performance metrics (passing yards, rushing yards, etc.)

## Tech Stack

- React
- TypeScript
- Plotly.js
- TailwindCSS
- Vite
- Claude 3 Sonnet (AI)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
