import * as actions from './actions';

const hideModal = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('welcomeModalHidden'));

export const initialState = {
  open: !hideModal,
  hideModal
};

const setModalWelcomeOpen = (state, { payload }) => ({
  ...state,
  open: payload,
  hideModal: true
});

export default {
  [actions.setModalWelcomeOpen]: setModalWelcomeOpen
};
