import { expect } from 'chai';
import sinon from 'sinon';

import { HTTPTransport } from '../my-fetch';

describe('HTTPTransport', () => {
  // @typescript-eslint/no-explicit-any
  let xhr: { onCreate: (req: any) => void; restore: () => void };
  // @typescript-eslint/no-explicit-any
  let requests: any[];

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = (req) => {
      requests.push(req);
    };
  });

  afterEach(() => {
    xhr.restore();
  });

  const myFetch = new HTTPTransport();

  it('should make a GET request', async () => {
    const url = '/data';
    const responseData = { message: 'GET request successful' };

    const promise = myFetch.get(url);
    requests[0].respond(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(responseData),
    );

    const response = await promise;
    expect(response).to.deep.equal(responseData);
  });

  it('should make a PUT request', async () => {
    const url = '/update';
    const requestData = { key: 'value' };
    const responseData = { message: 'PUT request successful' };

    const promise = myFetch.put(url, { data: requestData });
    requests[0].respond(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(responseData),
    );

    const response = await promise;
    expect(response).to.deep.equal(responseData);
  });

  it('should make a POST request', async () => {
    const url = '/create';
    const requestData = { key: 'value' };
    const responseData = { message: 'POST request successful' };

    const promise = myFetch.post(url, { data: requestData });
    requests[0].respond(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(responseData),
    );

    const response = await promise;
    expect(response).to.deep.equal(responseData);
  });

  it('should make a DELETE request', async () => {
    const url = '/delete';
    const responseData = { message: 'DELETE request successful' };

    const promise = myFetch.delete(url);
    requests[0].respond(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify(responseData),
    );

    const response = await promise;
    expect(response).to.deep.equal(responseData);
  });
});
