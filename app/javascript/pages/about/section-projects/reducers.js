import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  data: [],
  categorySelected: 'All',
};

const setProjectsLoading = (state, { payload }) => ({
  ...state,
  ...payload,
});

const setProjectsData = (state, { payload }) => ({
  ...state,
  data: payload,
});

const setCategorySelected = (state, { payload }) => ({
  ...state,
  categorySelected: payload,
});

export default {
  [actions.setProjectsLoading]: setProjectsLoading,
  [actions.setProjectsData]: setProjectsData,
  [actions.setCategorySelected]: setCategorySelected,
};
