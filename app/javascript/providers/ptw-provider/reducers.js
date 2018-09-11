import * as actions from './actions';

export const initialState = {
  loading: false,
  data: []
};

const setPTW = (state, { payload }) => ({
  ...state,
  data: payload
});

const setPTWLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setPTW]: setPTW,
  [actions.setPTWLoading]: setPTWLoading
};
