import * as actions from './actions';

export const initialState = {
  open: false,
};

const setFiresModalOpen = (state, { payload }) => ({
  ...state,
  open: payload,
});

export default {
  [actions.setFiresModalOpen]: setFiresModalOpen,
};
