import * as actions from './actions';

export const initialState = {
  loading: false,
  error: false,
  initialized: false,
  datasets: {},
};

const setGFWMeta = (state, { payload }) => ({
  ...state,
  ...payload,
});

const setGFWMetaLoading = (state, { payload }) => ({
  ...state,
  ...payload,
});

export default {
  [actions.setGFWMeta]: setGFWMeta,
  [actions.setGFWMetaLoading]: setGFWMetaLoading,
};
