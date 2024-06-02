enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

function queryStringify(data: { [x: string]: { toString: () => string } }) {
  if (!data || Object.keys(data).length < 1) {
    return '';
  }
  return `?${Object.keys(data)
    .map((key) => `${key}=${data[key].toString()}`)
    .join('&')}`;
}

interface Options {
  method: METHODS;
  timeout: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

type OptionsWithoutMethod = Omit<Options, 'method'>;

export default class HTTPTransport {
  get(url: string, options: OptionsWithoutMethod): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHODS.GET });
  }

  put(url: string, options: OptionsWithoutMethod) {
    this.request(url, { ...options, method: METHODS.PUT });
  }

  post(url: string, options: OptionsWithoutMethod) {
    this.request(url, { ...options, method: METHODS.POST });
  }

  delete(url: string, options: OptionsWithoutMethod) {
    this.request(url, { ...options, method: METHODS.DELETE });
  }

  request(
    url: string,
    options: Options = { method: METHODS.GET, headers: {}, timeout: 5000 },
  ): Promise<XMLHttpRequest> {
    const { method, data, headers, timeout } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

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

      xhr.onload = () => resolve(xhr);

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  }
}
