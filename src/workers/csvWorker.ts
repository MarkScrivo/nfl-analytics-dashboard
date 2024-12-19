import type { DataRow } from '../types';

const validateHeaders = (headers: string[]) => {
  if (!headers || headers.length === 0) {
    throw new Error('Invalid CSV headers');
  }
  return headers;
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

const processChunk = (chunk: string, headers: string[]): DataRow[] => {
  const lines = chunk.trim().split('\n');
  console.log('[Worker] Processing chunk with', lines.length, 'lines');
  
  return lines.map((line, index) => {
    const values = parseCSVLine(line);
    
    if (values.length !== headers.length) {
      throw new Error(`Row ${index + 1} has incorrect number of columns`);
    }

    const row: DataRow = {};
    headers.forEach((header, i) => {
      const value = values[i].replace(/^"|"$/g, '');
      row[header] = !isNaN(Number(value)) && value !== '' ? Number(value) : value;
    });
    
    return row;
  });
};

addEventListener('message', (event: MessageEvent) => {
  console.log('[Worker] Received message');
  
  try {
    const { content, chunkSize = 1000 } = event.data;
    console.log('[Worker] Processing content of length:', content.length);
    
    const lines = content.trim().split('\n');
    console.log('[Worker] Total lines:', lines.length);
    
    if (lines.length < 2) {
      throw new Error('CSV must contain at least a header row and one data row');
    }

    const headers = validateHeaders(parseCSVLine(lines[0]));
    console.log('[Worker] Headers:', headers);
    
    let processedRows: DataRow[] = [];
    
    // Process the data in chunks
    for (let i = 1; i < lines.length; i += chunkSize) {
      console.log('[Worker] Processing chunk starting at line', i);
      const chunk = lines.slice(i, i + chunkSize).join('\n');
      const rows = processChunk(chunk, headers);
      processedRows = processedRows.concat(rows);
      
      // Report progress
      const progress = Math.min(100, Math.round((i / lines.length) * 100));
      console.log('[Worker] Progress:', progress + '%');
      
      postMessage({
        type: 'progress',
        progress,
        chunk: rows
      });
    }

    console.log('[Worker] Processing complete. Total rows:', processedRows.length);
    postMessage({
      type: 'complete',
      data: processedRows
    });
  } catch (error) {
    console.error('[Worker] Error:', error);
    postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});
