import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  categorySelected: 'All',
  customFilter: [],
  countries: [],
  sgfModal: null,
};

const setProjectsLoading = (state, { payload }) => ({
  ...state,
  ...payload,
});

const setProjectsData = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload,
  },
  loading: false,
});

const setCategorySelected = (state, { payload }) => ({
  ...state,
  categorySelected: payload,
  customFilter: [],
});

const setCustomFilter = (state, { payload }) => ({
  ...state,
  customFilter: payload,
});

const setSearch = (state, { payload }) => ({
  ...state,
  search: payload,
  customFilter: [],
});

export default {
  [actions.setProjectsLoading]: setProjectsLoading,
  [actions.setProjectsData]: setProjectsData,
  [actions.setCategorySelected]: setCategorySelected,
  [actions.setSearch]: setSearch,
  [actions.setCustomFilter]: setCustomFilter,
};
