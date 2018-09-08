export const initialState = {
  loading: false,
  data: []
};

const setPTW = (state, { payload }) => ({
  ...state,
  data: payload
});

const setPTWLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  setPTW,
  setPTWLoading
};
