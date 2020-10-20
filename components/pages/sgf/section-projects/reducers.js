import * as actions from './actions';

export const initialState = {
  categorySelected: 'All',
  customFilter: [],
  sgfModal: null,
};

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
  [actions.setCategorySelected]: setCategorySelected,
  [actions.setSearch]: setSearch,
  [actions.setCustomFilter]: setCustomFilter,
};
