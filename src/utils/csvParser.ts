import type { DataRow } from '../types';

const validateCSVContent = (content: string) => {
  if (!content || typeof content !== 'string') {
    throw new Error('Invalid CSV content');
  }

  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row');
  }

  return lines;
};

const parseCSVLine = (line: string) => {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  values.push(currentValue.trim());
  return values;
};

export const parseCSV = (content: string): DataRow[] => {
  const lines = validateCSVContent(content);
  const headers = parseCSVLine(lines[0]);
  
  return lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    
    if (values.length !== headers.length) {
      throw new Error(`Row ${index + 1} has incorrect number of columns`);
    }

    const row: DataRow = {};
    headers.forEach((header, i) => {
      const value = values[i].replace(/^"|"$/g, ''); // Remove surrounding quotes if present
      // Convert to number if possible, otherwise keep as string
      row[header] = !isNaN(Number(value)) && value !== '' ? Number(value) : value;
    });
    
    return row;
  });
};