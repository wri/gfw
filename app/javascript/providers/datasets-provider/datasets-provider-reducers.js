import * as actions from './datasets-provider-actions';

export const initialState = {
  loading: true,
  error: false,
  data: []
};

const setDatasetsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setDatasets = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false
});

export default {
  [actions.setDatasets]: setDatasets,
  [actions.setDatasetsLoading]: setDatasetsLoading
};
