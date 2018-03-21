export const initialState = {
  loading: false,
  error: false,
  data: [],
  categorySelected: 'All',
  countries: []
};

const setProjectsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setProjectsData = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  },
  loading: false
});

const setCategorySelected = (state, { payload }) => ({
  ...state,
  categorySelected: payload
});

const setSearch = (state, { payload }) => ({
  ...state,
  search: payload
});

export default {
  setProjectsLoading,
  setProjectsData,
  setCategorySelected,
  setSearch
};
