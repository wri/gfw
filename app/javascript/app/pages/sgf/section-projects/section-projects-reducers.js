export const initialState = {
  loading: false,
  error: false,
  data: [],
  categorySelected: 'All',
  customFilter: [],
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
  categorySelected: payload,
  customFilter: []
});

const setCustomFilter = (state, { payload }) => ({
  ...state,
  customFilter: payload
});

const setSearch = (state, { payload }) => ({
  ...state,
  search: payload,
  customFilter: []
});

export default {
  setProjectsLoading,
  setProjectsData,
  setCategorySelected,
  setSearch,
  setCustomFilter
};
