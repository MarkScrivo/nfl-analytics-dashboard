# NFL Analytics Dashboard

A React-based dashboard for analyzing NFL game data with a focus on betting trends and performance metrics.

## Features

- CSV data upload and parsing
- Interactive visualizations using Plotly
- Betting trend analysis
- Performance metrics visualization
- Weather impact analysis
- Anomaly detection in betting patterns

## Live Demo

You can view and fork this project on StackBlitz:
[Open in StackBlitz](https://stackblitz.com/fork/github/your-username/nfl-analytics-dashboard)

## Getting Started

1. Fork the project on StackBlitz
2. Upload your NFL game data CSV file
3. Use the interactive filters to analyze specific teams or dates
4. Switch between Performance and Betting Analysis views

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

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
