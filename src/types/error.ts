export interface AppError {
  message: string;
  code: string;
  details?: string;
}

export const ErrorCodes = {
  CSV_INVALID: 'CSV_INVALID',
  CSV_EMPTY: 'CSV_EMPTY',
  CSV_WRONG_FORMAT: 'CSV_WRONG_FORMAT',
  FILE_READ_ERROR: 'FILE_READ_ERROR',
} as const;