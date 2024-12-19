/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope;

import type { DataRow } from '../types';

let headers: string[] = [];
let buffer = '';
let isFirstChunk = true;
let processedChunks = 0;
let totalChunks = 0;

const validateHeaders = (headerRow: string[]): string[] => {
  if (!headerRow || headerRow.length === 0) {
    throw new Error('Invalid CSV headers');
  }
  return headerRow;
};

const parseCSVLine = (line: string): string[] => {
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

const processRows = (rows: string[]): DataRow[] => {
  console.log('[Worker] Processing', rows.length, 'rows');
  return rows.map((row, index) => {
    const values = parseCSVLine(row);
    
    if (values.length !== headers.length) {
      throw new Error(`Row ${index + 1} has incorrect number of columns`);
    }

    const dataRow: DataRow = {};
    headers.forEach((header, i) => {
      const value = values[i].replace(/^"|"$/g, '');
      dataRow[header] = !isNaN(Number(value)) && value !== '' ? Number(value) : value;
    });
    
    return dataRow;
  });
};

const handleMessage = (event: MessageEvent) => {
  try {
    const { content, isFirstChunk: isFirst, isLastChunk, chunkNumber, totalChunks: total } = event.data;
    console.log(`[Worker] Processing chunk ${chunkNumber} of ${total}`);

    if (isFirst) {
      // Reset state for new file
      isFirstChunk = true;
      buffer = '';
      headers = [];
      processedChunks = 0;
      totalChunks = total;
    }

    processedChunks++;

    // Append new content to buffer
    buffer += content;

    // Split buffer into lines, keeping the last partial line in the buffer
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep the last line if it's incomplete

    // If this is the first chunk, extract headers
    if (isFirstChunk && lines.length > 0) {
      headers = validateHeaders(parseCSVLine(lines[0]));
      console.log('[Worker] Headers:', headers);
      lines.shift(); // Remove header line
      isFirstChunk = false;
    }

    // Process complete lines
    if (lines.length > 0) {
      const rows = processRows(lines);
      console.log('[Worker] Processed', rows.length, 'rows');
      self.postMessage({
        type: 'progress',
        progress: Math.round((processedChunks / totalChunks) * 100),
        chunk: rows
      });
    }

    // If this is the last chunk, process any remaining data in buffer
    if (isLastChunk) {
      console.log('[Worker] Processing final chunk');
      if (buffer.trim()) {
        const rows = processRows([buffer.trim()]);
        if (rows.length > 0) {
          self.postMessage({
            type: 'progress',
            progress: 100,
            chunk: rows
          });
        }
      }
      
      // Signal completion
      console.log('[Worker] Processing complete');
      self.postMessage({
        type: 'complete'
      });
    }

  } catch (error) {
    console.error('[Worker] Error:', error);
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

// Register message handler
self.addEventListener('message', handleMessage);

// Export empty object to satisfy module requirements
export default {};
