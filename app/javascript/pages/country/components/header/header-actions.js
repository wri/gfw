import { createAction } from 'redux-actions';

const setInitialState = createAction('setInitialState');
const setRegion = createAction('setRegion');

export default {
  setInitialState,
  setRegion
};
