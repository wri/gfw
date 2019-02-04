import * as actions from './actions';

export const initialState = {
  open: false
};

const setModalNewsletterOpen = (state, { payload }) => ({
  ...state,
  open: payload,
  showConfirm: false
});

export default {
  [actions.setModalNewsletterOpen]: setModalNewsletterOpen
};
