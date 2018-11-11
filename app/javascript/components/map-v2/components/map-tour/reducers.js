import * as actions from './actions';

export const initialState = {
  open: true
};

const setMapTourOpen = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  [actions.setMapTourOpen]: setMapTourOpen
};
