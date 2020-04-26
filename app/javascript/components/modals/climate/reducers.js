import * as actions from './actions';

export const initialState = {
  open: false,
};

const setClimateModalOpen = (state, { payload }) => ({
  ...state,
  open: payload,
});

export default {
  [actions.setClimateModalOpen]: setClimateModalOpen,
};
