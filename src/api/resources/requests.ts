import { YandexApi } from '../config/urls';
import myFetch from '../my-fetch';

const BASE_URL = YandexApi;

export const getResource = (path: string) => {
  return myFetch.get(BASE_URL + `/resources/${path}`, {
    params: { responseType: 'blob' },
  });
};
