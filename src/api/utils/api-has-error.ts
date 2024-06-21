import { APIError } from '@src/api/types/errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiHasError = (response: any): response is APIError => {
  return response?.reason;
};
