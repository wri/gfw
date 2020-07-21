import { handleActions, createAction } from 'redux-actions';

const handleModule = ({ reducers, initialState }) =>
  handleActions(reducers.default || reducers, initialState || {});

const createThunkAction = (name, thunkAction, metaCreator) => {
  const action = createAction(name, null, metaCreator);
  if (!thunkAction) return action;
  const returnAction = payload => (dispatch, getState) => {
    dispatch(action());
    return thunkAction(payload)(dispatch, getState);
  };

  returnAction.toString = () => name;
  return returnAction;
};

export { createAction, handleModule, createThunkAction };
