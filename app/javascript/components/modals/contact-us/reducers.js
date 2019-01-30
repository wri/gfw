import * as actions from './actions';

export const initialState = {
  open: false
};

const setModalContactUsOpen = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  [actions.setModalContactUsOpen]: setModalContactUsOpen
};
