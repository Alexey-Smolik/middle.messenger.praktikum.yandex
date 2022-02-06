const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

function queryStringify(data) {
  return Object.keys(data).reduce((prev, curr) => {
    switch (typeof data[curr]) {
      case 'number':
      case 'string':
      case 'boolean':
        prev += `${curr}=${data[curr]}&`;
        return prev;
      case 'object':
        if (Array.isArray(data[curr])) {
          prev += `${curr}=${data[curr].join()}&`;
        } else {
          prev += `${curr}=[object Object]&`;
        }

        return prev;
    }
  }, '?').slice(0, -1);
}

class HTTPTransport {
  get = (url, options = { }) => {
    return this.request(url, {...options, method: METHODS.GET}, options.timeout);
  };

  post = (url, options = {}) => {
    return this.request(url, {...options, method: METHODS.POST}, options.timeout);
  };

  put = (url, options = {}) => {
    return this.request(url, {...options, method: METHODS.PUT}, options.timeout);
  };

  delete = (url, options = {}) => {
    return this.request(url, {...options, method: METHODS.DELETE}, options.timeout);
  };

  request = (url, options, timeout = 5000) => {
    const {method, data, headers} = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (headers) {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      xhr.timeout = timeout;
      xhr.open(method, url + (method === METHODS.GET && data ? queryStringify(data) : ''));

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}
