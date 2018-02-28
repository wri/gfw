export const initialState = {
  loading: true,
  middleView: null
};

const setRootLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  setRootLoading
};
