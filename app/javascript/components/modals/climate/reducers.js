import * as actions from './actions';

export const initialState = {
  open: false,
};

const setModalGFWClimateOpen = (state, { payload }) => ({
  ...state,
  open: payload,
});

export default {
  [actions.setModalGFWClimateOpen]: setModalGFWClimateOpen,
};
