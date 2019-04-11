import Case from 'case';
import attachKey from './utils/attach_key';
import { isFunction } from './utils/type_check';
import ensureRequiredParams from './utils/ensure_required_params';

// Should be moved to its own file
const getUrl = (getter, type, action) => {
  // FIXME: Tests
  if (action.url) {
    return action.url;
  }

  // FIXME: Tests
  if (getter && getter[type] && isFunction(getter[type])) {
    let fn = getter[type];
    return fn(action);
  }

  // FIXME: Tests
  if (getter && getter.default && isFunction(getter.default)) {
    return getter.default(action);
  }

  return 'invalid_route';

  // FIXME: Console.warn error or throw "no url" error!
};

const createDefaultActions = (key, _options = {}) => {
  const constKey = Case.constant(key);

  const options = Object.assign({}, _options, {
    requiredParams: {},
  });

  // TODO: Validate required params?
  const { requiredParams } = options;

  const IS_LOADING = 'IS_LOADING';
  const isLoading = id => ({
    type: attachKey(constKey, IS_LOADING),
    id,
  });

  const IS_LOADING_COMPLETE = 'IS_LOADING_COMPLETE';
  const isLoadingComplete = id => ({
    type: attachKey(constKey, IS_LOADING_COMPLETE),
    id,
  });

  const MERGE_DATA_FROM_API = 'MERGE_DATA_FROM_API';
  const mergeDataFromApi = (payload, options = {}) => ({
    type: MERGE_DATA_FROM_API,
    source: constKey,
    payload,
    options,
  });

  const MERGE_DATA_FROM_BACKBONE = 'MERGE_DATA_FROM_BACKBONE';
  const mergeDataFromBackbone = (payload, options = {}) => ({
    type: MERGE_DATA_FROM_BACKBONE,
    source: constKey,
    payload,
    options,
  });

  // const FETCH = 'FETCH';
  // const fetch = (actionOptions = {}, options = {}) => {
  //   const action = {
  //     type: attachKey(constKey, FETCH),
  //     ...actionOptions,
  //     options,
  //   };
  //   const url = getUrl(_options.getUrl, 'fetch', action);
  //   return ensureRequiredParams({
  //     actionName: 'fetch',
  //     requiredParams: requiredParams.fetch,
  //     action: () => ({
  //       ...action,
  //       url,
  //     }),
  //   });
  // };

  // const CREATE = 'CREATE';
  // const create = (payload, actionOptions = {}, options = {}) => {
  //   const action = {
  //     type: attachKey(constKey, CREATE),
  //     ...actionOptions,
  //     payload,
  //     options,
  //   };
  //   const url = getUrl(_options.getUrl, 'create', action);
  //   return ensureRequiredParams({
  //     actionName: 'create',
  //     requiredParams: requiredParams.create,
  //     action: () => ({
  //       ...action,
  //       url,
  //     }),
  //   });
  // };

  // const UPDATE = 'UPDATE';
  // const update = (payload, actionOptions = {}, options = {}) => {
  //   const action = {
  //     type: attachKey(constKey, UPDATE),
  //     ...actionOptions,
  //     payload,
  //     options,
  //   };
  //   const url = getUrl(_options.getUrl, 'update', action);
  //   return ensureRequiredParams({
  //     actionName: 'update',
  //     requiredParams: requiredParams.create,
  //     action: () => ({
  //       ...action,
  //       url,
  //     }),
  //   });
  // };

  // const CREATE_OR_UPDATE = 'CREATE_OR_UPDATE';
  // const createOrUpdate = (payload, actionOptions = {}, options = {}) => {
  //   const action = {
  //     type: attachKey(constKey, CREATE_OR_UPDATE),
  //     ...actionOptions,
  //     payload,
  //     options,
  //   };
  //   const type = actionOptions.id || payload.id ? 'update' : 'create';
  //   const url = getUrl(_options.getUrl, 'update', action);
  //   return ensureRequiredParams({
  //     actionName: 'createOrUpdate',
  //     requiredParams: requiredParams.createOrUpdate,
  //     action: () => ({
  //       ...action,
  //       url,
  //       chosenType: type,
  //     }),
  //   });
  // };

  // const DESTROY = 'DESTROY';
  // const destroy = (payload, actionOptions = {}, options = {}) => {
  //   const action = {
  //     type: attachKey(constKey, DESTROY),
  //     ...actionOptions,
  //     payload,
  //     options,
  //   };
  //   const url = getUrl(_options.getUrl, 'destroy', action);
  //   return ensureRequiredParams({
  //     actionName: 'destroy',
  //     requiredParams: requiredParams.destroy,
  //     action: () => ({
  //       ...action,
  //       url,
  //     }),
  //   });
  // };

  return {
    isLoading,
    isLoadingComplete,
    mergeDataFromApi,
    // mergeDataFromBackbone,
    // fetch,
    // create,
    // update,
    // createOrUpdate,
    // destroy,
  };
};

export default createDefaultActions;
