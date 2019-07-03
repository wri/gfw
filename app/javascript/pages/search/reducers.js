import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  data: []
};

const setSearchLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

const setSearchData = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false,
  error: false
});

export default {
  [actions.setSearchLoading]: setSearchLoading,
  [actions.setSearchData]: setSearchData
};
