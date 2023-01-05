const HOST = 'http://localhost:3000/api';

export const client = (baseUrl) => {
  const request = (
    route,
    { method = 'GET', headers = { ...request.headers }, body = null }
  ) => {
    return new Promise((resolve, reject) => {
      fetch(`${baseUrl}${route}`, {
        headers,
        body,
        method,
      })
        .then((response) => {
          return Promise.all([response.json(), response.ok]);
        })
        .then(([data, isOk]) => {
          if (isOk) {
            return resolve(data);
          }

          const error = new Error();
          error.data = data;

          reject(error);
        })
        .catch((err) => {
          const error = new Error();
          error.data = { info: err.message };
          reject(error);
        });
    });
  };

  request.headers = {};

  return request;
};

export const apiClient = client(HOST);
