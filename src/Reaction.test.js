import Reaction from './Reaction';
import regeneratorRuntime from 'regenerator-runtime';
import { call, put } from 'redux-saga/effects';
import { runSaga } from 'redux-saga';
// Mock imports
import * as ApiHelper from './utils/api';
const MockApiHelper = jest.genMockFromModule('./utils/api');

async function recordSaga(saga, initialAction) {
  const dispatched = [];

  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    saga,
    initialAction
  ).done;

  return dispatched;
}

describe('Reaction Class', () => {
  describe('Instantiation', () => {
    it('should fail instantiation without a name', () => {});

    it('should insantiate with a single name parameter', () => {
      const model = new Reaction({ name: 'things' });
      expect(model).toHaveProperty('name', 'things');
    });

    it('should contain all default actions', () => {
      const model = new Reaction({ name: 'things' });
      expect(model).toHaveProperty('Actions');
      expect(model).toHaveProperty('Actions.isLoading');
      expect(model).toHaveProperty('Actions.isLoadingComplete');
      expect(model).toHaveProperty('Actions.mergeDataFromApi');

      // expect(model).toHaveProperty('Actions.fetch');
      // expect(model).toHaveProperty('Actions.create');
      // expect(model).toHaveProperty('Actions.update');
      // expect(model).toHaveProperty('Actions.createOrUpdate');
      // expect(model).toHaveProperty('Actions.destroy');
    });

    it('should contain the proper methods', () => {
      const model = new Reaction({ name: 'reaction' });
      expect(model).toHaveProperty('createFlow');
      expect(model).toHaveProperty('createSaga');
      expect(model).toHaveProperty('createWrapper');
    });

    it('should create initial state', () => {
      const model = new Reaction({ name: 'test' });
      expect(model.initialState).toHaveProperty('isLoading', false);
      expect(model.initialState).toHaveProperty('isLoadingById', {});
      expect(model.initialState).toHaveProperty('byId', {});
    });

    it('should extend initial state', () => {
      const model = new Reaction({
        name: 'test',
        initialState: {
          foo: 'bar',
        },
      });
      expect(model.initialState).toHaveProperty('isLoading', false);
      expect(model.initialState).toHaveProperty('isLoadingById', {});
      expect(model.initialState).toHaveProperty('byId', {});
      expect(model.initialState).toHaveProperty('foo', 'bar');
    });

    it('should provide reducers', () => {
      const model = new Reaction({ name: 'test' });
      console.log(model.getReducer());
    });
  });

  describe('createFlow', () => {
    it('should create a single action flow', () => {
      const model = new Reaction({ name: 'test' });
      const someFlow = model.createFlow(
        'someFlow',
        ({ test }) => ({ test }),
        null
      );

      expect(model.Actions.someFlow({ test: 'foobar' })).toEqual({
        type: 'TEST/SOME_FLOW',
        test: 'foobar',
      });
    });
  });

  describe('createWrapper', () => {
    const model = new Reaction({ name: 'test' });
    it('should wrap and create new actions and constants', () => {
      model.createWrapper('mergeDataFromBackbone', 'mergeDataFromApi');
      expect(model.Actions).toHaveProperty('mergeDataFromBackbone');
      // expect(model.Constants).toHaveProperty('');
      console.log(model);
      console.log(model.Actions.mergeDataFromBackbone({ foo: 'bar' }));
    });

    xit('should throw if override function is not a valid type', () => {});

    xit('should return a fetch action with an overrideName', () => {
      model.createWrapper('doFetch', 'fetch');
      expect(model).toHaveProperty('Actions.doFetch');
      let action = model.Actions.doFetch({ foo: 'bar' });
      expect(action).toHaveProperty('type', 'TEST/FETCH');
      expect(action).toHaveProperty('foo', 'bar');
      expect(action).toHaveProperty('overrideName', 'doFetch');
      expect(action).toHaveProperty('overriddenMethod', 'fetch');
    });

    xit('should throw when explicit in requiredParams are missing', () => {
      model.createWrapper('doFetch', 'fetch', {
        requiredParams: ['bar'],
      });
      expect(() => {
        model.Actions.doFetch({ foo: 'bar' });
      }).toThrow();
    });

    xit('should throw when implicit requiredParams are missing', () => {
      const anotherModel = new Reaction({
        name: 'test',
        requiredParams: {
          doFetch: ['bar', 'foo'],
        },
      });
      anotherModel.createWrapper('doFetch', 'fetch');
      expect(() => {
        anotherModel.Actions.doFetch({ foo: 'bar' });
      }).toThrow();
    });

    xit('should not throw when explicit requiredParams override implicit parameters', () => {
      const anotherModel = new Reaction({
        name: 'test',
        requiredParams: {
          doFetch: ['bar'],
        },
      });
      expect(() => {
        anotherModel.Actions.doFetch({ foo: 'bar' });
      }).toThrow();
      anotherModel.createWrapper('doFetch', 'fetch', {
        requiredParams: ['foo'],
      });
      expect(() => {
        anotherModel.Actions.doFetch({ foo: 'bar' });
      }).not.toThrow();
    });
  });

  xdescribe('Default Sagas', () => {
    ApiHelper.get = jest.fn();

    it('should contain default sagas', () => {
      const model = new Reaction({
        name: 'test',
      });
      expect(model).toHaveProperty('Sagas');
      expect(model.Sagas).toHaveProperty('TEST/FETCH');
      expect(model.Sagas['TEST/FETCH']).toHaveProperty('fn');
      expect(model.Sagas['TEST/FETCH']).toHaveProperty('watch');
      expect(model.Sagas['TEST/FETCH']).toHaveProperty(
        'constant',
        'TEST/FETCH'
      );

      // const dispatched = await recordSaga(
      //   model.Sagas[model.Constants.FETCH].fn,
      //   model.Actions.fetch({ foo: 'foos', bar: 'bars' })
      // );
    });

    xit('should call a fetch action', () => {});

    xit('should call a create action', () => {});
    // FIXME:

    xit('should use getUrl', () => {});

    xit('should call fetch and dispatch a loading and loadingComplete action', async () => {
      const model = new Reaction({
        name: 'test',
        getUrl: {
          default(action) {
            return `foo/bar`;
          },
          fetch(action) {
            if (action.foo && action.bar) {
              let { foo, bar } = action;
              return `foo/${foo}/bar/${bar}`;
            }
          },
        },
        interceptRequest(request) {
          return request;
        },
      });

      console.log(model);

      const dispatched = await recordSaga(
        model.Sagas[model.Constants.FETCH].fn,
        model.Actions.fetch({ foo: 'foos', bar: 'bars' })
      );

      expect(dispatched).toContainEqual({
        id: undefined,
        type: 'TEST/IS_LOADING',
      });
      expect(dispatched).toContainEqual({
        id: undefined,
        type: 'TEST/IS_LOADING_COMPLETE',
      });

      const anotherDispatched = await recordSaga(
        model.Sagas[model.Constants.FETCH].fn,
        model.Actions.fetch({ foo: 'foos', bar: 'bars', id: 1 })
      );

      expect(anotherDispatched).toContainEqual({
        id: 1,
        type: 'TEST/IS_LOADING',
      });
      expect(anotherDispatched).toContainEqual({
        id: 1,
        type: 'TEST/IS_LOADING_COMPLETE',
      });
    });

    xit('should call an action and allow a generic intercept', async () => {
      const model = new Reaction({
        name: 'test',
        getUrl: {
          default(action) {
            return `foo/bar`;
          },
          fetch(action) {
            if (action.foo && action.bar) {
              let { foo, bar } = action;
              return `foo/${foo}/bar/${bar}`;
            }
          },
        },
        interceptRequest(request) {
          return request;
        },
      });

      await recordSaga(
        model.Sagas[model.Constants.FETCH].fn,
        model.Actions.fetch({ foo: 'foos', bar: 'bars' })
      );

      expect(ApiHelper.get).toHaveBeenCalledWith({
        route: `foo/foos/bar/bars`,
        intercept: model._options.interceptRequest,
      });
    });

    xit('should call an action and allow an explicit intercept', async () => {
      const model = new Reaction({
        name: 'test',
        getUrl: {
          default(action) {
            return `foo/bar`;
          },
          fetch(action) {
            if (action.foo && action.bar) {
              let { foo, bar } = action;
              return `foo/${foo}/bar/${bar}`;
            }
          },
        },
        interceptRequest: {
          fetch(request) {
            return request;
          },
        },
      });

      await recordSaga(
        model.Sagas[model.Constants.FETCH].fn,
        model.Actions.fetch({ foo: 'foos', bar: 'bars' })
      );

      expect(ApiHelper.get).toHaveBeenCalledWith({
        route: `foo/foos/bar/bars`,
        intercept: model._options.interceptRequest.fetch,
      });
    });

    xit('should call an action and allow an explicit intercept override', async () => {
      // const model = new Reaction({
      //   name: 'test',
      //   getUrl: {
      //     default(action) {
      //       return `foo/bar`;
      //     },
      //     fetch(action) {
      //       if (action.foo && action.bar) {
      //         let { foo, bar } = action;
      //         return `foo/${foo}/bar/${bar}`;
      //       }
      //     },
      //   },
      //   interceptRequest: {
      //     fetch(request) {
      //       return request;
      //     },
      //   },
      // });
      // const dispatched = await recordSaga(
      //   model.Sagas[model.Constants.FETCH].fn,
      //   model.Actions.fetch({ foo: 'foos', bar: 'bars' })
      // );
      // expect(ApiHelper.get).toHaveBeenCalledWith({
      //   route: `foo/foos/bar/bars`,
      //   intercept: model._options.interceptRequest,
      // });
      // console.log(dispatched);
    });
  });
});

// xdescribe('Name of the group', () => {
//   it('test', async () => {
//     const model = new Reaction({ name: 'test' });
//     const actionA = model.createFlow('actionA', ({ foo, bar }) => ({
//       foo,
//       bar,
//     }));
//     const actionB = model.createFlow('actionB', ({ foo }) => ({ foo }));
//     const actionC = model.createFlow('actionC', ({ bar }) => ({ bar }));

//     const asyncA = model.createSaga(actionA.constant, function*(action) {
//       try {
//         console.log('action!', action);
//         console.log('foo', action.foo);
//         console.log('bar', action.bar);
//         yield put(actionB.action({ foo: action.foo }));
//         yield put(actionC.action({ bar: action.bar }));
//       } catch (e) {
//         console.log('eee', e);
//       }
//     });

//     const dispatched = await recordSaga(
//       asyncA.fn,
//       actionA.action({ foo: 'foos', bar: 'bars' })
//     );
//     console.log('dispatched', dispatched);
//     console.log(model.getForks());
//   });
// });
