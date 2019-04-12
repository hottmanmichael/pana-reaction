import Case from 'case';
import { isFunction, isString } from './type_check';
import isEmpty from './is_empty';
import ensureRequiredParams from './ensure_required_params';

const noop = () => ({});
const noop_reducer = state => state;

const defaultOptions = {
  async: false,
  requiredParams: [],
};

const formatActionNamesFromString = (name, reducerKey, options) => {
  const actionName = Case.camel(name);
  let constantKey = Case.constant(name);

  if (options && options.async) {
    constantKey = `[SAGA]/${constantKey}`;
  }

  const actionType = `${reducerKey}/${constantKey}`;

  return { actionName, actionType, constantKey };
};

const formatActionNamesFromObject = (nameObject, reducerKey, options) => {
  const actionName = nameObject.actionName;
  const constantKey = nameObject.constant;
  let actionType = constantKey;
  if (nameObject.merge) {
    actionType = `${reducerKey}/${constantKey}`;
  }
  return { actionName, actionType, constantKey };
};

const formatActionNames = (name, reducerKey, options = {}) => {
  if (isString(name))
    return formatActionNamesFromString(name, reducerKey, options);
  else if (matchesNameObjectConvention(name))
    return formatActionNamesFromObject(name, reducerKey, options);
  else {
    throw new Error(
      `Invalid param used in ${reducerKey}.createFlow - Expected String or {actionName, constant} but received ${name} instead.`
    );
  }
};
const matchesNameObjectConvention = obj => {
  return (
    obj &&
    obj.hasOwnProperty &&
    obj.hasOwnProperty('actionName') &&
    obj.hasOwnProperty('constant')
  );
};

const validateAction = (action, actionName) => {
  if (!isFunction(action) && action !== null) {
    const message = `${k}/${actionName} has an invalid action. Action must be a function or null.`;
    throw new Error(message);
  }
};

const validateReducer = (reducer, actionName) => {
  if (
    !isFunction(reducer) &&
    reducer !== null &&
    'undefined' !== typeof reducer
  ) {
    const message = `${k}/${actionName} has an invalid reducer. Reducer must be a function, null, or undefined.`;
    throw new Error(message);
  }
};

export default key => {
  let reducerKey = key.toUpperCase();

  return function createFlow(
    createFlowName,
    createFlowAction = noop,
    createFlowReducer = null,
    createFlowOptions = defaultOptions
  ) {
    // Merge with default options
    const options = Object.assign({}, defaultOptions, createFlowOptions);

    // Format names
    const { actionName, constantKey, actionType } = formatActionNames(
      createFlowName,
      reducerKey,
      options
    );

    // Validate Params
    validateAction(createFlowAction, actionName);
    validateReducer(createFlowReducer, actionName);

    // Create bounded action with ensured params wrapper
    const boundAction = function bindAction() {
      const payload = isFunction(createFlowAction)
        ? createFlowAction.apply(null, arguments)
        : {};
      return ensureRequiredParams({
        actionName: createFlowName,
        requiredParams: options.requiredParams,
        action: () => ({
          type: actionType,
          ...payload,
        }),
      });
    };

    return {
      // Public API
      // Useful for testing or calling directly if needed
      actionName,
      reducer: createFlowReducer,
      constant: actionType,
      action: boundAction,

      // Internal API
      // Used to spread onto existing Reaction properties
      _internal: {
        Action: { [actionName]: boundAction },
        Reducer: { [`${reducerKey}/${constantKey}`]: createFlowReducer },
        Constant: { [`${constantKey}`]: `${reducerKey}/${constantKey}` },
      },
    };
  };
};
