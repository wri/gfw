import * as actions from './actions';

export const initialState = {
  open: false,
};

const setModalGFWFiresOpen = (state, { payload }) => ({
  ...state,
  open: payload,
});

export default {
  [actions.setModalGFWFiresOpen]: setModalGFWFiresOpen,
};
