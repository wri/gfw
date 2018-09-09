export const initialState = {
  showConfirm: false,
  submitting: false,
  error: false
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
  setShowConfirm,
  setFormSubmitting
};
