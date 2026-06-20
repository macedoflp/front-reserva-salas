import axios from 'axios';
import type { AxiosError } from 'axios';
import type { ApiClientError, ApiErrorResponse, ApiSuccessResponse } from '@/types';
import { env } from '@/utils/env';

type ApiErrorHandler = (error: ApiClientError) => void;

let apiErrorHandler: ApiErrorHandler | null = null;

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse> | unknown) => {
    const normalizedError = normalizeApiError(error);
    apiErrorHandler?.(normalizedError);

    return Promise.reject(normalizedError);
  },
);

export function setApiErrorHandler(handler: ApiErrorHandler): void {
  apiErrorHandler = handler;
}

export function unwrapApiData<T>(payload: ApiSuccessResponse<T> | T): T {
  if (isApiSuccessResponse(payload)) {
    return payload.data;
  }

  return payload;
}

export function normalizeApiError(error: AxiosError<ApiErrorResponse> | unknown): ApiClientError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response;
    const responseBody = response?.data;

    return {
      error: responseBody?.error ?? error.name,
      isNetworkError: !response,
      message:
        responseBody?.message ??
        error.message ??
        'Não foi possível concluir a comunicação com a API.',
      path: responseBody?.path,
      statusCode: responseBody?.statusCode ?? response?.status ?? 0,
      timestamp: responseBody?.timestamp,
    };
  }

  return {
    error: 'Unexpected Error',
    isNetworkError: false,
    message: error instanceof Error ? error.message : 'Erro inesperado.',
    statusCode: 0,
  };
}

function isApiSuccessResponse<T>(value: ApiSuccessResponse<T> | T): value is ApiSuccessResponse<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'data' in value &&
    'statusCode' in value
  );
}
