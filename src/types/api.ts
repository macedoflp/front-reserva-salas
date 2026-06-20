export interface ApiSuccessResponse<T> {
  data: T;
  path: string;
  statusCode: number;
  timestamp: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  path: string;
  statusCode: number;
  timestamp: string;
}

export interface ApiClientError {
  error?: string;
  isNetworkError: boolean;
  message: string;
  path?: string;
  statusCode: number;
  timestamp?: string;
}

