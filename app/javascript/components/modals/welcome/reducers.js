import * as actions from './actions';

export const initialState = {
  open: true
};

const setModalWelcome = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  [actions.setModalWelcome]: setModalWelcome
};
