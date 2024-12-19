import type { DataRow } from '../types';

export const calculateBinCount = (data: number[]): number => {
  return Math.min(20, Math.ceil(Math.sqrt(data.length)));
};

export const getColumnValues = (data: DataRow[], column: string): (number | string)[] => {
  return data.map(row => {
    const value = row[column];
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleanValue = value.replace(/,/g, '');
      const num = Number(cleanValue);
      return !isNaN(num) ? num : value;
    }
    return '';
  });
};

export const getNumericValues = (data: DataRow[], column: string): number[] => {
  return data
    .map(row => {
      const value = row[column];
      // Handle both string and number types
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        // Remove any commas and try to convert to number
        const cleanValue = value.replace(/,/g, '');
        const num = Number(cleanValue);
        if (!isNaN(num)) return num;
      }
      console.warn(`Invalid numeric value for column ${column}:`, value);
      return NaN;
    })
    .filter((value): value is number => {
      const isValid = !isNaN(value);
      if (!isValid) {
        console.warn('Filtered out invalid numeric value:', value);
      }
      return isValid;
    });
};

export const formatDate = (dateStr: string): string => {
  try {
    // Handle both M/D/YY and YYYY-MM-DD formats
    const date = dateStr.includes('-') 
      ? new Date(dateStr)
      : new Date(dateStr.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2})/, '20$3-$1-$2'));
    
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', dateStr, error);
    return dateStr;
  }
};

export const getCategoryDistribution = (data: DataRow[], column: string): [string, number][] => {
  const valueCount: { [key: string]: number } = {};
  
  data.forEach(row => {
    const value = String(row[column]).trim();
    if (value !== '') {
      valueCount[value] = (valueCount[value] || 0) + 1;
    }
  });

  return Object.entries(valueCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
};

export const getCorrelation = (xValues: number[], yValues: number[]): number => {
  if (xValues.length !== yValues.length || xValues.length === 0) {
    return 0;
  }

  const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
  const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;

  const numerator = xValues.reduce((sum, x, i) => 
    sum + (x - xMean) * (yValues[i] - yMean), 0);

  const xVariance = xValues.reduce((sum, x) => 
    sum + Math.pow(x - xMean, 2), 0);
  const yVariance = yValues.reduce((sum, y) => 
    sum + Math.pow(y - yMean, 2), 0);

  const denominator = Math.sqrt(xVariance * yVariance);

  return denominator === 0 ? 0 : numerator / denominator;
};

export const getMovingAverage = (data: number[], window: number): number[] => {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const values = data.slice(start, i + 1);
    result.push(values.reduce((a, b) => a + b, 0) / values.length);
  }
  return result;
};

export const getTrendData = (data: DataRow[], column: string, dateColumn: string = 'date'): [string[], number[]] => {
  const sortedData = [...data].sort((a, b) => 
    formatDate(String(a[dateColumn])).localeCompare(formatDate(String(b[dateColumn])))
  );
  
  const dates = sortedData.map(row => formatDate(String(row[dateColumn])));
  const values = getNumericValues(sortedData, column);
  
  return [dates, values];
};
