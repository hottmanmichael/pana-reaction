import Case from 'case';
import { isFunction, isString } from './type_check';

const noop = () => ({});
const noop_reducer = state => state;

const defaultOptions = {
  async: false,
};

/**
 * createFlow(name, action, reducer)
 * args
 * - name : [string or object] ->
 *    - will generate actionName and CONSTANT_NAME from string
 *    - or will use actionKey and constantKey
 * - action : [function or null]
 */

// FIXME: Rewrite this, it's garbage

export default key => {
  let k = key.toUpperCase();
  return function createFlow(
    name,
    action = noop,
    reducer = noop_reducer,
    options = defaultOptions
  ) {
    let _actionName = Case.camel(name);
    let _constantKey = Case.constant(name);

    // FIXME: Should handle custom constant/action names
    // if (!isString(name)) {
    //   var { actionName, constantKey } = name;
    //   _actionName = actionKey;
    //   _constantKey = constantKey;
    // }

    let _options = Object.assign({}, defaultOptions, options);

    if (_options.async) {
      _constantKey = `[SAGA]/${constantKey}`;
    }

    // Setup API
    const Action = function bindAction() {
      if (!isFunction(action) && action !== null)
        console.warn(
          `${k}/${_actionName} has an invalid action. Action must be a function or null.`
        );
      const payload = isFunction(action) ? action.apply(null, arguments) : {};
      return {
        type: `${k}/${_constantKey}`,
        ...payload,
      };
    };
    const ActionName = `${_actionName}`;
    const Reducer = reducer;
    const Constant = `${k}/${_constantKey}`;

    return {
      // Public API
      // Useful for testing or calling directly if needed
      action: Action,
      actionName: ActionName,
      reducer: Reducer,
      constant: Constant,

      // Internal API
      // Used to spread onto existing Reaction properties
      _internal: {
        Action: { [_actionName]: Action },
        Reducer: { [`${k}/${_constantKey}`]: reducer },
        Constant: { [`${_constantKey}`]: `${k}/${_constantKey}` },
      },
    };
  };
};
