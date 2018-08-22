export const initialState = {
  loading: false,
  error: false,
  data: {}
};

const setLatestLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setLatest = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false
});

export default {
  setLatest,
  setLatestLoading
};
