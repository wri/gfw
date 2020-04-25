import * as actions from './actions';

export const initialState = {
  open: false
};

const setProfileModalOpen = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  [actions.setProfileModalOpen]: setProfileModalOpen
};
