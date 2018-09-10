import * as actions from './actions';

export const initialState = {
  loading: true
};

const setRootLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  [actions.setRootLoading]: setRootLoading
};
