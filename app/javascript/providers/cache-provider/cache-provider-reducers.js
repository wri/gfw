export const initialState = {
  cacheListLoading: true,
  cacheList: [],
  error: false
};

const setCacheList = (state, { payload }) => ({
  ...state,
  cacheListLoading: false,
  cacheList: payload
});

const setCacheError = (state, { payload }) => ({
  ...state,
  cacheListLoading: false,
  error: payload
});

export default {
  setCacheList,
  setCacheError
};
