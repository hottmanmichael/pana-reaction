import Case from 'case';
import attachKey from './utils/attach_key';

const createDefaultConstants = (key, options) => {
  const constKey = Case.constant(key);
  return {
    MERGE_DATA_FROM_API: 'MERGE_DATA_FROM_API',
    IS_LOADING: attachKey(constKey, 'IS_LOADING'),
    IS_LOADING_COMPLETE: attachKey(constKey, 'IS_LOADING_COMPLETE'),
    // FETCH: attachKey(constKey, 'FETCH'),
    // CREATE: attachKey(constKey, 'CREATE'),
    // UPDATE: attachKey(constKey, 'UPDATE'),
    // CREATE_OR_UPDATE: attachKey(constKey, 'CREATE_OR_UPDATE'),
    // DESTROY: attachKey(constKey, 'DESTROY'),
  };
};

export default createDefaultConstants;
