import * as actions from './latest-provider-actions';

export const initialState = {
  loading: true,
  error: false
};

const setLatestLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  [actions.setLatestLoading]: setLatestLoading
};
