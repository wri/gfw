import * as actions from './actions';

const hideModal = JSON.parse(localStorage.getItem('tclDislaimerModalHidden'));

export const initialState = {
  open: !hideModal
};

const setModalTCLDisclaimerOpen = (state, { payload }) => ({
  ...state,
  open: payload
});

export default {
  [actions.setModalTCLDisclaimerOpen]: setModalTCLDisclaimerOpen
};
