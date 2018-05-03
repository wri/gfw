export const initialState = {
  cacheListLoading: false,
  cacheList: []
};

const setCacheListLoading = (state, { payload }) => ({
  ...state,
  cacheListLoading: payload
});

const setCacheList = (state, { payload }) => ({
  ...state,
  cacheListLoading: false,
  cacheList: payload
});

export default {
  setCacheListLoading,
  setCacheList
};
