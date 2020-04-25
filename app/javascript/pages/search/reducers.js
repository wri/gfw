import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  query: '',
  data: [],
};

const setSearchLoading = (state, { payload }) => ({
  ...state,
  loading: payload,
});

const setSearchQuery = (state, { payload }) => ({
  ...state,
  query: payload,
});

const setSearchData = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false,
  error: false,
});

export default {
  [actions.setSearchLoading]: setSearchLoading,
  [actions.setSearchQuery]: setSearchQuery,
  [actions.setSearchData]: setSearchData,
};
