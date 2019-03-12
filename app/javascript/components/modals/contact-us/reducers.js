import * as actions from './actions';

export const initialState = {
  open: false
};

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
  [actions.setShowConfirm]: setShowConfirm,
  [actions.setFormSubmitting]: setFormSubmitting
};
