import type { DataRow, AnalyticsResult, ColumnStats } from '../types';

type DataValue = string | number | null | undefined;

const isNumericValue = (value: DataValue): boolean => {
  if (typeof value === 'number') return true;
  if (typeof value === 'string') {
    const cleanValue = value.replace(/,/g, '');
    return !isNaN(Number(cleanValue)) && cleanValue.trim() !== '';
  }
  return false;
};

const getNumericValue = (value: DataValue): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleanValue = value.replace(/,/g, '');
    return Number(cleanValue);
  }
  return NaN;
};

const analyzeColumn = (values: DataValue[]): ColumnStats => {
  console.log('Analyzing column with', values.length, 'values');
  console.log('Sample values:', values.slice(0, 3));

  // Check if all non-empty values are numeric
  const nonEmptyValues = values.filter((v): v is string | number => 
    v !== '' && v != null && v !== undefined
  );
  const numericValues = nonEmptyValues
    .filter(isNumericValue)
    .map(getNumericValue)
    .filter(v => !isNaN(v));

  console.log('Found', numericValues.length, 'numeric values');

  if (numericValues.length > 0 && numericValues.length === nonEmptyValues.length) {
    const stats = {
      type: 'numeric' as const,
      uniqueValues: new Set(numericValues).size,
      average: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
      max: Math.max(...numericValues),
      min: Math.min(...numericValues)
    };
    console.log('Numeric stats:', stats);
    return stats;
  }

  // Handle as string column
  const stats = {
    type: 'string' as const,
    uniqueValues: new Set(nonEmptyValues.map(String)).size
  };
  console.log('String stats:', stats);
  return stats;
};

export const analyzeData = (data: DataRow[]): AnalyticsResult => {
  console.log('Starting data analysis with', data.length, 'rows');
  console.log('Sample row:', data[0]);

  if (!Array.isArray(data) || data.length === 0) {
    console.log('No data to analyze');
    throw new Error('No data to analyze');
  }

  try {
    const columns = Object.keys(data[0]);
    console.log('Found columns:', columns);

    const columnStats: { [key: string]: ColumnStats } = {};

    columns.forEach(column => {
      console.log('Analyzing column:', column);
      try {
        const values = data.map(row => row[column]);
        columnStats[column] = analyzeColumn(values);
      } catch (err) {
        console.warn(`Error analyzing column ${column}:`, err);
        columnStats[column] = {
          type: 'string',
          uniqueValues: 0
        };
      }
    });

    const result: AnalyticsResult = {
      columnStats,
      rowCount: data.length,
      columnCount: columns.length
    };

    console.log('Analysis complete');
    return result;

  } catch (error) {
    console.error('Error during analysis:', error);
    throw new Error('Failed to analyze data: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};
