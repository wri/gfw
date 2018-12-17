import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  data: {}
};

const setGeostore = (state, { payload }) => ({
  ...state,
  data: {
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
