import * as actions from './actions';

export const initialState = {
  pathname: '',
  payload: {},
  query: {},
  search: '',
};

const setLocation = (state, { payload }) => payload;

export default {
  [actions.setLocation]: setLocation,
};
