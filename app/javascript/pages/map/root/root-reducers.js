export const initialState = {
  loading: true
};

const setRootLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  setRootLoading
};
