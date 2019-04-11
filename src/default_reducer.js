import Case from 'case';
import deepmerge from 'deepmerge';
import attachKey from './utils/attach_key';

const overrideMerge = (destinationArray, sourceArray, options) => sourceArray;
const unionMerge = (destinationArray, sourceArray, options) =>
  _.union([...destinationArray], [...sourceArray]);
const defaultDeepmergeOptions = {
  arrayMerge: overrideMerge,
};

const createDefaultReducer = (key, options = {}) => {
  const constKey = Case.constant(key);

  let { deepmergeOptions } = options;
  let mergeOptions = deepmergeOptions || defaultDeepmergeOptions;

  const IS_LOADING = attachKey(constKey, 'IS_LOADING');
  const isLoading = (state, action) => {
    let isLoading = true;
    if (typeof action.id !== 'undefined') {
      return {
        ...state,
        isLoadingById: {
          ...state.isLoadingById,
          [action.id]: isLoading,
        },
      };
    } else {
      return {
        ...state,
        isLoading,
      };
    }
  };

  const IS_LOADING_COMPLETE = attachKey(constKey, 'IS_LOADING_COMPLETE');
  const isLoadingComplete = (state, action) => {
    let isLoading = false;
    if (typeof action.id !== 'undefined') {
      return {
        ...state,
        isLoadingById: {
          ...state.isLoadingById,
          [action.id]: isLoading,
        },
      };
    } else {
      return {
        ...state,
        isLoading,
      };
    }
  };

  const MERGE_DATA_FROM_API = 'MERGE_DATA_FROM_API';
  const mergeDataFromApi = (state, action) => {
    if (!action.payload[key]) return state;
    if (
      action.options &&
      Array.isArray(action.options.include) &&
      action.options.include.indexOf(key) === -1
    ) {
      return state;
    }
    let byId = deepmerge(state.byId, action.payload[key], mergeOptions);
    return {
      ...state,
      byId,
    };
  };

  return {
    [IS_LOADING]: isLoading,
    [IS_LOADING_COMPLETE]: isLoadingComplete,
    [MERGE_DATA_FROM_API]: mergeDataFromApi,
  };
};

export default createDefaultReducer;
