const DEFAULT_API_URL = 'http://localhost:3000/api/v1';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export const env = {
  apiUrl: trimTrailingSlash(import.meta.env.VITE_API_URL || DEFAULT_API_URL),
};

