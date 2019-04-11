import regeneratorRuntime from 'regenerator-runtime';
import { all, takeLatest, takeEvery, fork } from 'redux-saga/effects';

const defaultOptions = {
  takeMethod: 'takeEvery',
};

function createSaga(constant, fn, options = defaultOptions) {
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

  var method;
  if (options.takeMethod === 'takeEvery') {
    method = takeEvery;
  } /* if (options.takeMethod === 'takeLatest') */ else {
    method = takeLatest;
  }

  function* watch() {
    yield method(constant, fn);
  }

  return {
    fn,
    watch,
    constant,
  };
}

export default createSaga;
