import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { getFileError } from '../../utils/errors';
import { Alert } from '../ui/Alert';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { DataRow } from '../../types';
import type { AppError } from '../../types/error';

interface FileUploadProps {
  onFileUpload: (data: DataRow[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    return values.map(value => value.replace(/^"|"$/g, ''));
  };

  const parseCSV = (text: string): DataRow[] => {
    console.log('Starting CSV parsing');
    
    // Split into lines and remove empty lines
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length < 2) {
      throw new Error('CSV must contain at least a header row and one data row');
    }

    // Parse headers
    const headers = parseCSVLine(lines[0]);
    console.log('Headers:', headers);

    const data: DataRow[] = [];
    let errorCount = 0;
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        
        if (values.length === headers.length) {
          const row = headers.reduce((acc, header, index) => {
            const value = values[index];
            // Try to convert to number if possible
            const cleanValue = value.replace(/,/g, '');
            const numValue = Number(cleanValue);
            acc[header] = !isNaN(numValue) && cleanValue !== '' ? numValue : value;
            return acc;
          }, {} as Record<string, string | number>);
          
          data.push(row as DataRow);
        } else {
          console.warn(`Row ${i + 1}: Expected ${headers.length} columns but got ${values.length}`);
          errorCount++;
        }
      } catch (err) {
        console.warn(`Error parsing row ${i + 1}:`, err);
        errorCount++;
      }

      // Stop if too many errors
      if (errorCount > 10) {
        throw new Error('Too many parsing errors. Please check your CSV format.');
      }
    }

    if (data.length === 0) {
      throw new Error('No valid data rows found in CSV');
    }

    console.log('Successfully parsed', data.length, 'rows');
    console.log('Sample row:', data[0]);
    return data;
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Processing file:', file.name, 'size:', file.size);
    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      console.log('File content loaded, length:', text.length);
      
      const data = parseCSV(text);
      console.log('CSV parsed successfully');
      
      onFileUpload(data);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(getFileError(err));
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = '';
    }
  }, [onFileUpload]);

  return (
    <div className="max-w-xl mx-auto">
      {error && (
        <Alert
          type="error"
          message={error.message}
          details={error.details}
          onDismiss={() => setError(null)}
        />
      )}
      
      <div className="mt-4 p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center">
          {isLoading ? (
            <div className="space-y-3">
              <LoadingSpinner className="mx-auto" />
              <p className="text-gray-600">Processing file...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-blue-500 mx-auto" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload CSV File</h2>
                <p className="mt-1 text-sm text-gray-500">Select a CSV file to analyze</p>
              </div>
              <div className="mt-4">
                <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
