type PlainObject<T = unknown> = {
    [k in string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
    return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value: unknown): value is [] {
    return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is [] | PlainObject {
    return isPlainObject(value) || isArray(value);
}

function getKey(key: string, parentKey?: string) {
    return parentKey ? `${parentKey}[${key}]` : key;
}

function getParams(data: PlainObject | [], parentKey?: string) {
    const result: [string, string][] = [];

    for(const [key, value] of Object.entries(data)) {
        if (isArrayOrObject(value)) {
            result.push(...getParams(value, getKey(key, parentKey)));
        } else {
            result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
        }
    }

    return result;
}

function queryStringify(data: PlainObject) {
    if (!isPlainObject(data)) {
        throw new Error('input must be an object');
    }

    return getParams(data).map(arr => arr.join('=')).join('&');
}

const defaultHeaders = {
    'Cache-Control': 'no-cache',
    'content-type': 'application/json',
};

const defaultUrl = 'https://ya-praktikum.tech/api/v2';

const METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

export class HTTPTransport {
    get = (url, options = {}) => {
        return this.request(url + (options.data ? queryStringify(options.data) : ''), {...options, method: METHODS.GET}, options.timeout);
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

    private getXHRHTTPRequestResult = (
        xhr: XMLHttpRequest,
    ) => {
        return {
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText,
            headers: xhr.getAllResponseHeaders(),
            data: xhr.responseText,
            json: <T>() => JSON.parse(xhr.responseText) as T,
        };
    };

    private request = (url: string, options= { }, timeout = 5000) => {
        const { headers = defaultHeaders, data, method } = options;

        const self = this;
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, defaultUrl + url, true);
            xhr.withCredentials = true;
            const isMultiPartHeader = headers?.['content-type'] === 'multipart/form-data';
            const headerKeys = Object.keys(isMultiPartHeader ? {} : headers);

            if (headerKeys.length) {
                headerKeys.forEach((key) => {
                    xhr.setRequestHeader(key, headers[key]);
                });
            }

            xhr.onload = function () {
                if (!(xhr.status >= 200 && xhr.status < 300)) {
                    reject(self.getXHRHTTPRequestResult(xhr));
                }

                resolve(self.getXHRHTTPRequestResult(xhr));
            };

            xhr.timeout = timeout;
            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else if (isMultiPartHeader) {
                xhr.send(data);
            } else {
                xhr.send(JSON.stringify(data));
            }
        });
    };
}
