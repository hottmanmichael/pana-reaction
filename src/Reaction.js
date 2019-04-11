import regeneratorRuntime from 'regenerator-runtime';
import { all, takeLatest, takeEvery, fork } from 'redux-saga/effects';
import isGeneratorFunction from 'is-generator-function';
import Case from 'case';
import ensureRequiredParams from './utils/ensure_required_params';
import createFlow from './utils/create_flow';
import createSaga from './utils/create_saga';
import attachKey from './utils/attach_key';

import getInitialState from './default_state';
import createDefaultReducer from './default_reducer';
import createDefaultConstants from './default_constants';
import createDefaultActions from './default_actions';
// import createDefaultSagas from './default_sagas';

import createReducer from './utils/create_reducer';

const defaultOptions = {
  // TODO: Enforce camelCase
  name: null,

  // Normalizr Options
  // schema: {},
  // schemaOptions: {},
  // collectionOptions: {},

  requiredParams: {},

  // getUrl: {
  //   default() {
  //     return '';
  //   },
  //   fetch() {
  //     return '';
  //   },
  //   create() {
  //     return '';
  //   },
  //   update() {
  //     return '';
  //   },
  //   destroy() {
  //     return '';
  //   },
  // },

  // TODO: Helper Methods
  // interceptRequest(request) {
  //   const token = 1234;
  //   request.set('Authorization', `Bearer ${token}`);
  //   return request;
  // }

  // baseUrl() {
  //   return 'https://example.com';
  // }

  // getIsDevelopmentEnvironment() {
  //   return false;
  // }

  reducerOptions: null,
};

const defaultAsyncOptions = {
  takeMethod: 'takeEvery',
};

export default class Reaction {
  constructor(options) {
    this._options = Object.assign({}, defaultOptions, options);

    this.name = options.name;
    if (!this.name) {
      throw new Error('ReactionNameError');
    }

    this.initialState = getInitialState(options.initialState);
    this.Constants = createDefaultConstants(this.name);
    this.Actions = createDefaultActions(this.name, {
      requiredParams: this._requiredParams,
      // getUrl: this._options.getUrl || defaultOptions.getUrl,
    });
    this.Reducers = createDefaultReducer(this.name, this.reducerOptions);
    this.Sagas = {};

    // this.Sagas = createDefaultSagas({
    //   Actions: this.Actions,
    //   Constants: this.Constants,
    //   // interceptRequest: this._options.interceptRequest,
    // });
  }

  createWrapper(overrideName, overriddenMethod, options = {}) {
    // TODO: Throw error if Actions[overriddenMethod] ! exists
    // TODO: Throw error if Actions[overrideName] already exists

    const upper = this.name.toUpperCase();
    const constKey = Case.constant(overrideName);
    const constValue = attachKey(upper, constKey);
    const prevConstKey = Case.constant(overriddenMethod);
    const prevConstValue = attachKey(upper, prevConstKey);

    const flow = {
      Action: {
        [overrideName]: (...args) =>
          ensureRequiredParams({
            requiredParams:
              options.requiredParams ||
              this._options.requiredParams[overrideName],
            actionName: overrideName,
            action: () => {
              let actionValue = this.Actions[overriddenMethod].apply(
                this,
                args
              );
              return {
                ...actionValue,
                mockType: actionValue.type,
                type: constValue,
                overrideName,
                overriddenMethod,
              };
            },
          }),
      },
      Constant: { [constKey]: constValue },
    };

    this.attachFlow(flow);
  }

  createFlow(...args) {
    const creator = createFlow(this.name);
    const flow = creator.apply(this, args);
    this.attachFlow(flow._internal);
    return flow;
  }

  attachFlow(flow) {
    if (flow.Constant) {
      this.Constants = {
        ...this.Constants,
        ...flow.Constant,
      };
    }

    if (flow.Reducer) {
      this.Reducer = {
        ...this.Reducer,
        ...flow.Reducer,
      };
    }

    if (flow.Action) {
      this.Actions = {
        ...this.Actions,
        ...flow.Action,
      };
    }
  }

  createSaga(...args) {
    const saga = createSaga.apply(this, args);
    this.attachSaga(saga);
    return saga;
  }

  attachSaga(async) {
    this.Sagas = {
      ...this.Sagas,
      [async.constant]: async,
    };
  }

  getForks() {
    let forks = [];
    Object.keys(this.Sagas).forEach(saga => {
      const forkable = this.Sagas[saga].watch;
      forks.push(fork(forkable));
    });
    return all(forks);
  }

  getReducer() {
    return createReducer(this.initialState, this.Reducers);
  }
}
