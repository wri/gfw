import * as actions from './actions';

export const initialState = {
  open: false
};

const setModalContactUsOpen = (state, { payload }) => ({
  ...state,
  open: payload
});

const setShowConfirm = (state, { payload }) => ({
  ...state,
  showConfirm: payload,
  submitting: false,
  error: false
});

const setFormSubmitting = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  [actions.setModalContactUsOpen]: setModalContactUsOpen,
  [actions.setShowConfirm]: setShowConfirm,
  [actions.setFormSubmitting]: setFormSubmitting
};
