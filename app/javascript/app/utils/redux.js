import isFunction from 'lodash/isFunction';
import { createAction as CA, handleActions as handle } from 'redux-actions';

// matches action names with reducers and returns an object to
// be used with handleActions
// passes all state as a third argument
export const bindActionsToReducers = (actions, reducerList) =>
  Object.keys(actions).reduce((result, k) => {
    const c = {};
    const name = actions[k];
    c[name] = (state, action) =>
      reducerList.reduce((r, reducer) => {
        const hasProperty = Object.prototype.hasOwnProperty.call(reducer, k);
        if (!hasProperty || !isFunction(reducer[k])) return r;
        return reducer[k](r, action);
      }, state);

    console.log(c);
    return { ...result, ...c };
  }, {});

export const handleActions = ({ actions, reducers, initialState }) => {
  if (typeof reducers === 'undefined') {
    throw new Error('One of your reducers is undefined.');
  }
  return handle(bindActionsToReducers(actions, [reducers]), initialState || {});
};

// our own actioncreattor that can handle thunks
// fires the action as init
// and leaves resolve/reject to the thunk creator
export const createThunkAction = (name, thunkAction) => {
  if (!thunkAction) return CA(name);
  thunkAction.toString = () => name; // eslint-disable-line
  return thunkAction;
};
