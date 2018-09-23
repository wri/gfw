import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  geostore: {}
};

const setGeostore = (state, { payload }) => ({
  ...state,
  geostore: {
    ...payload
  }
});

const setGeostoreLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  [actions.setGeostore]: setGeostore,
  [actions.setGeostoreLoading]: setGeostoreLoading
};
