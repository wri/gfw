export const initialState = {
  loading: false,
  error: false,
  data: [],
  categorySelected: 'All'
};

const setProjectsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setProjectsData = (state, { payload }) => ({
  ...state,
  data: payload
});

const setCategorySelected = (state, { payload }) => ({
  ...state,
  categorySelected: payload
});

export default {
  setProjectsLoading,
  setProjectsData,
  setCategorySelected
};
