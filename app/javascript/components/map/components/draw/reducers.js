import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  geostoreId: ''
};

const setGeostoreId = (state, { payload }) => ({
  ...state,
  geostoreId: payload,
  loading: false
});

const setDrawLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  [actions.setGeostoreId]: setGeostoreId,
  [actions.setDrawLoading]: setDrawLoading
};
