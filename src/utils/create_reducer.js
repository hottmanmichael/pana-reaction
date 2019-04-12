import { isFunction } from './type_check';

export default function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (
      handlers.hasOwnProperty(action.mockType) &&
      isFunction(handlers[action.mockType])
    ) {
      return handlers[action.mockType](state, action);
    } else if (
      handlers.hasOwnProperty(action.type) &&
      isFunction(handlers[action.type])
    ) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}
