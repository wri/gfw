import * as actions from './actions';

export const initialState = {
  loading: false,
  data: {}
};

const setWhitelistLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

const setWhitelist = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

export default {
  [actions.setWhitelistLoading]: setWhitelistLoading,
  [actions.setWhitelist]: setWhitelist
};
