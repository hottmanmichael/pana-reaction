import request from 'superagent';

const _makeRequest = ({ method, route, data, intercept }) => {
  return new Promise((resolve, reject) => {
    let req = request[method](route);
    if (data) req.send(JSON.parse(JSON.stringify(data)));
    if (intercept) req = intercept(req);
    // FIXME: Throw error if res.body doesn't exist or if res.code is not 200?
    req.then(res => resolve(res.body)).catch(reject);
  });
};

export const get = ({ route, intercept }) => {
  return _makeRequest({
    route,
    intercept,
    method: 'get',
  });
};

export const post = ({ route, data, intercept }) => {
  return _makeRequest({
    data,
    route,
    intercept,
    method: 'post',
  });
};

export const put = ({ route, data, intercept }) => {
  return _makeRequest({
    data,
    route,
    intercept,
    method: 'put',
  });
};

export const patch = ({ route, data, intercept }) => {
  return _makeRequest({
    data,
    route,
    intercept,
    method: 'patch',
  });
};

export const destroy = ({ route, data, intercept }) => {
  return _makeRequest({
    data,
    route,
    intercept,
    method: 'delete',
  });
};
