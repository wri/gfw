import * as actions from './actions';

const hideModal = JSON.parse(localStorage.getItem('welcomeModalHidden'));

export const initialState = {
  open: !hideModal
};

const setModalWelcomeOpen = (state, { payload }) => ({
  ...state,
  open: payload,
  title: hideModal ? 'dfadsada' : 'Welcome to the new Global Forest Watch map!'
});

export default {
  [actions.setModalWelcomeOpen]: setModalWelcomeOpen
};
