import * as actions from './actions';

export const initialState = {};

const setLocation = (state, { payload }) => payload;

export default {
  [actions.setLocation]: setLocation
};
