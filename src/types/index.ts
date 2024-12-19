import { PlotData as PlotlyData } from 'plotly.js';

export interface BaseDataRow {
  [key: string]: string | number;
}

export interface NFLGameData extends BaseDataRow {
  date: string;
  season_type: string;
  home_team: string;
  away_team: string;
  weather: string;
  spread: number;
  total: number;
  home_ml: number;
  away_ml: number;
  opening_spread: number;
  opening_total: number;
  spread_bet_pct: number;
  total_bet_pct: number;
  ml_bet_pct: number;
  home_passing_yards: number;
  home_rushing_yards: number;
  home_passing_attempts: number;
  home_rushing_attempts: number;
  home_passing_completions: number;
  home_passing_touchdowns: number;
  home_rushing_touchdowns: number;
  home_interceptions: number;
  home_fumbles: number;
  home_time_of_possession: number;
  home_first_downs_passing: number;
  home_first_downs_rushing: number;
  home_first_downs_penalty: number;
  home_third_down_attempts: number;
  home_third_down_conversions: number;
  home_fourth_down_attempts: number;
  home_fourth_down_conversions: number;
  home_penalties: number;
  home_penalty_yards: number;
  home_safeties: number;
  home_passer_rating: number;
  home_yards_per_play: number;
  away_passing_yards: number;
  away_rushing_yards: number;
  away_passing_attempts: number;
  away_rushing_attempts: number;
  away_passing_completions: number;
  away_passing_touchdowns: number;
  away_rushing_touchdowns: number;
  away_interceptions: number;
  away_fumbles: number;
  away_time_of_possession: number;
  away_first_downs_passing: number;
  away_first_downs_rushing: number;
  away_first_downs_penalty: number;
  away_third_down_attempts: number;
  away_third_down_conversions: number;
  away_fourth_down_attempts: number;
  away_fourth_down_conversions: number;
  away_penalties: number;
  away_penalty_yards: number;
  away_safeties: number;
  away_passer_rating: number;
  away_yards_per_play: number;
}

export type DataRow = BaseDataRow & Partial<NFLGameData>;

export interface ColumnStats {
  type: 'numeric' | 'string';
  uniqueValues: number;
  average?: number;
  max?: number;
  min?: number;
}

export interface AnalyticsResult {
  columnStats: { [key: string]: ColumnStats };
  rowCount: number;
  columnCount: number;
}

export type PlotType = 'scatter' | 'bar' | 'box' | 'violin';

export interface Visualization {
  type: PlotType;
  x: string;
  y: string;
  title: string;
  xaxis: string;
  yaxis: string;
}

export interface Insight {
  text: string;
  visualization?: Visualization;
}

export interface AIResponse {
  insights: Insight[];
}

export type CustomPlotData = Partial<PlotlyData> & {
  type: PlotType;
  x: (string | number)[];
  y: (string | number)[];
  mode?: 'lines' | 'markers' | 'lines+markers';
  name?: string;
  marker?: {
    color?: string | number[] | string[];
    size?: number;
    colorscale?: string;
    showscale?: boolean;
    colorbar?: {
      title?: string;
    };
  };
  text?: string[];
  hovertemplate?: string;
};
