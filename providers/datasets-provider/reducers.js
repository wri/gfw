import * as actions from './actions';

export const initialState = {
  loading: true,
  error: false,
  meta: null,
  data: [],
};

const setDatasetsLoading = (state, { payload }) => ({
  ...state,
  ...payload,
});

const setDatasets = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false,
});

const setDatasetMetadata = (state, { payload }) => ({
  ...state,
  meta: payload,
});

export default {
  [actions.setDatasets]: setDatasets,
  [actions.setDatasetMetadata]: setDatasetMetadata,
  [actions.setDatasetsLoading]: setDatasetsLoading,
};
