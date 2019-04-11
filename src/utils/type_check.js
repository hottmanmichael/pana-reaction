export const isFunction = fn => {
  return fn && {}.toString.call(fn) === '[object Function]';
};

export const isString = st => {
  return st && ('string' === typeof st || st instanceof String);
};
