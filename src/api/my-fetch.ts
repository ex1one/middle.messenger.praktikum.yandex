import { TKeyofMethods } from './types/methods';
import { queryStringify } from './utils/query-stringify';
import METHODS from './config/methods';
import { isValidJSON } from '@src/api/utils';

interface Options {
  method: TKeyofMethods;
  timeout?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  params?: Pick<XMLHttpRequest, 'responseType'>;
}

type OptionsWithoutMethod = Omit<Options, 'method'>;

class HTTPTransport {
  get = <T>(url: string, options?: OptionsWithoutMethod) => {
    return this.request<T>(url, { ...options, method: METHODS.GET });
  };

  put = <T>(url: string, options?: OptionsWithoutMethod) => {
    return this.request<T>(url, { ...options, method: METHODS.PUT });
  };

  post = <T>(url: string, options?: OptionsWithoutMethod) => {
    return this.request<T>(url, { ...options, method: METHODS.POST });
  };

  delete = <T>(url: string, options?: OptionsWithoutMethod) => {
    return this.request<T>(url, { ...options, method: METHODS.DELETE });
  };

  request<T>(url: string, options: Options): Promise<T> {
    const {
      method = METHODS.GET,
      data,
      headers = {},
      timeout = 5000,
      params = { responseType: 'text' },
    } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.withCredentials = true;
      xhr.responseType = params.responseType;
      xhr.open(
        method,
        isGet && !!data ? `${url}${queryStringify(data)}` : url,
        true,
      );

      xhr.timeout = timeout;

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      xhr.onload = () => {
        try {
          if (xhr.status > 299) {
            reject(xhr.responseText);
          }
          resolve(
            isValidJSON(xhr.response) ? JSON.parse(xhr.response) : xhr.response,
          );
        } catch (error) {
          reject(error);
        }
      };

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        if (data instanceof FormData) {
          xhr.send(data);
        } else {
          xhr.setRequestHeader(
            'Content-type',
            'application/json; charset=utf-8',
          );
          xhr.send(JSON.stringify(data));
        }
      }
    });
  }
}

const myFetch = new HTTPTransport();

export default myFetch;
