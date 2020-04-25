import * as actions from './actions';

export const initialState = {
  open: false
};

const setContactUsModalOpen = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  [actions.setContactUsModalOpen]: setContactUsModalOpen
};
