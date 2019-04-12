import get from './get';
import isEmpty from './is_empty';

const throwRequiredParamWarning = (
  fullActionValue,
  getterString,
  actionName
) => {
  let action = fullActionValue.type || actionName;
  let message = `${action} expected to contain the parameter "${getterString}" but received the action (${JSON.stringify(
    fullActionValue
  )}) instead.`;
  throw new Error(message);
};

const validateAtKey = (actionResult, getterString, actionName) => {
  if (!get(actionResult, getterString))
    throwRequiredParamWarning(actionResult, getterString, actionName);
};

export default ({ actionName, requiredParams, action }) => {
  let actionResult = action();
  actionResult.requiredParams = requiredParams;

  if (isEmpty(requiredParams)) {
    return actionResult;
  }

  // Bypass override if using createWrapper
  if (
    actionResult &&
    actionResult.overrideName &&
    actionResult.overrideName !== actionName
  ) {
    return actionResult;
  }

  return (function validateParams() {
    if (Array.isArray(requiredParams) && requiredParams.length) {
      requiredParams.forEach(param => {
        try {
          validateAtKey(actionResult, param, actionName);
        } catch (e) {
          console.error(e);
        }
      });
    }
    return actionResult;
  })();
};
