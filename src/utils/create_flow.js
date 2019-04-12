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

export default key => {
  let k = key.toUpperCase();
  return function createFlow(
    name,
    action = noop,
    reducer = null,
    options = defaultOptions
  ) {
    let _actionName, _constantKey;
    let _options = Object.assign({}, defaultOptions, options);

    if (isString(name)) {
      _actionName = Case.camel(name);
      _constantKey = Case.constant(name);
    } else if (name && name.actionName && name.constant) {
      _actionName = name.actionName;
      _constantKey = name.constant;
    } else {
      // FIXME: Throw warning for invalid name param
      throw new Error(
        `Invalid param used in ${key}.createFlow - Expected String or {actionName, constant} but received ${name} instead.`
      );
    }

    if (!isFunction(action) && action !== null)
      console.warn(
        `${k}/${_actionName} has an invalid action. Action must be a function or null.`
      );

    if (_options.async) {
      _constantKey = `[SAGA]/${constantKey}`;
    }

    const actionType =
      isString(name) || (name && name.merge)
        ? `${k}/${_constantKey}`
        : _constantKey;

    const constant = actionType;
    const boundAction = function bindAction() {
      const payload = isFunction(action) ? action.apply(null, arguments) : {};
      return ensureRequiredParams({
        actionName: name,
        requiredParams: _options.requiredParams,
        action: () => ({
          type: actionType,
          ...payload,
        }),
      });
    };

    return {
      // Public API
      // Useful for testing or calling directly if needed
      reducer,
      constant,
      action: boundAction,
      actionName: _actionName,

      // Internal API
      // Used to spread onto existing Reaction properties
      _internal: {
        Action: { [_actionName]: boundAction },
        Reducer: { [`${k}/${_constantKey}`]: reducer },
        Constant: { [`${_constantKey}`]: `${k}/${_constantKey}` },
      },
    };
  };
};
