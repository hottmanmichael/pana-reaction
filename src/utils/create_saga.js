import regeneratorRuntime from 'regenerator-runtime';
import { all, takeLatest, takeEvery, fork } from 'redux-saga/effects';
import { isFunction } from './type_check';

const defaultOptions = {
  yield: 'takeEvery',
  watch: undefined,
};

function createSaga(constant, fn, _options = defaultOptions) {
  if ('string' !== typeof constant) {
    throw new Error(
      `The argument (${constant}) passed into createAsync is not a valid parameter. Constant must be typeof string.`
    );
    return;
  }

  // if (!isGeneratorFunction(fn)) {
  //   throw new Error(
  //     `The argument (${fn}) passed into createAsync is not a valid parameter. Fn must be valid generator function.`
  //   );
  //   return;
  // }

  const options = Object.assign({}, defaultOptions, _options);

  var watch;
  if (options.watch && isFunction(options.watch)) {
    watch = options.watch;
  } else {
    const method = options.yield === 'takeEvery' ? takeEvery : takeLatest;
    watch = function* watch() {
      yield method(constant, fn);
    };
  }

  return {
    fn,
    watch,
    constant,
  };
}

export default createSaga;
