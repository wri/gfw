import * as actions from './actions';

export const initialState = {
  loading: true,
  error: false,
  data: {}
};

const setMyGFWLoading = (state, { payload }) => ({
  ...state,
  ...payload,
  data: {}
});

const setMyGFW = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false
});

export default {
  [actions.setMyGFW]: setMyGFW,
  [actions.setMyGFWLoading]: setMyGFWLoading
};
