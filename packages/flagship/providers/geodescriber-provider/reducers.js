import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  data: {}
};

const setGeodescriber = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false,
  error: false
});

const clearGeodescriber = state => ({
  ...state,
  data: {}
});

const setGeodescriberLoading = (state, { payload }) => ({
  ...state,
  loading: payload.loading,
  error: payload.error
});

export default {
  [actions.setGeodescriber]: setGeodescriber,
  [actions.clearGeodescriber]: clearGeodescriber,
  [actions.setGeodescriberLoading]: setGeodescriberLoading
};
