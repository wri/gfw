import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  data: {}
};

const setGeostore = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  }
});

const clearGeostore = state => ({
  ...state,
  data: {}
});

const setGeoDescriber = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    geodescriber: payload
  },
  loading: false,
  error: false
});

const setGeostoreLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  [actions.setGeostore]: setGeostore,
  [actions.clearGeostore]: clearGeostore,
  [actions.setGeoDescriber]: setGeoDescriber,
  [actions.setGeostoreLoading]: setGeostoreLoading
};
