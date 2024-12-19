import { AppError, ErrorCodes } from '../types/error';

export const createError = (code: keyof typeof ErrorCodes, message: string, details?: string): AppError => ({
  code,
  message,
  details,
});

export const getFileError = (error: unknown): AppError => {
  if (error instanceof Error) {
    if (error.message.includes('Invalid CSV content')) {
      return createError(
        'CSV_INVALID',
        'Invalid CSV File',
        'The file appears to be empty or corrupted. Please check the file and try again.'
      );
    }
    if (error.message.includes('must contain at least')) {
      return createError(
        'CSV_EMPTY',
        'Empty CSV File',
        'The CSV file must contain at least a header row and one data row.'
      );
    }
    if (error.message.includes('incorrect number of columns')) {
      return createError(
        'CSV_WRONG_FORMAT',
        'Invalid CSV Format',
        'The CSV file has inconsistent number of columns. Please ensure all rows have the same number of columns.'
      );
    }
  }
  
  return createError(
    'FILE_READ_ERROR',
    'Unable to Read File',
    'There was an error reading the file. Please try again with a different file.'
  );
};