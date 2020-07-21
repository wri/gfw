import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  data: {}
};

const setLatestLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setLatestDates = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  },
  loading: false,
  error: false
});

export default {
  [actions.setLatestLoading]: setLatestLoading,
  [actions.setLatestDates]: setLatestDates
};
