import regeneratorRuntime from 'regenerator-runtime';
import { put, call } from 'redux-saga/effects';
import attachKey from './utils/attach_key';
import createSaga from './utils/create_saga';
import { isFunction } from './utils/type_check';
import * as ApiHelper from './utils/api';

const getIntercept = (intercept, type, fallbackType) => {
  // FIXME: interceptRequest TESTS
  // FIXME: Needs documentation
  /**
   * interceptRequest (request) => {request}
   * {
   *  default(), fetch(), create(), etc...
   * }
   */
  const defaultIntercept = request => request;
  if (intercept) {
    if (isFunction(intercept)) {
      return intercept;
    } else {
      let fn = intercept[type];
      if (!fn) {
        fn = intercept[fallbackType];
      }
      return isFunction(fn) ? fn : defaultIntercept;
    }
  } else return defaultIntercept;
};

const createDefaultSagas = ({ Actions, Constants, interceptRequest }) => {
  const fetch = createSaga(Constants.FETCH, function*(action) {
    try {
      let { overrideName, url, method } = action;

      // FIXME: Throw error if no url is present
      // FIXME: Throw error if method is invalid

      yield put(Actions.isLoading(action.id));

      // Perform fetch api request
      let intercept = getIntercept(interceptRequest, overrideName, 'fetch');
      const apiResult = yield call(ApiHelper.get, {
        intercept,
        route: url,
      });

      // console.log(apiResult);

      // normalize request
      // mergeFromApi
      yield put(Actions.isLoadingComplete(action.id));
    } catch (e) {
      console.error(e);
      // FIXME: Catch no url error here
      yield put(Actions.isLoadingComplete(action.id));
    }
  });

  return {
    [fetch.constant]: fetch,
  };
};

export default createDefaultSagas;
