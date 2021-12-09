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

const setDatasetsWithMetadata = (state, { payload }) => ({
  ...state,
  ...payload,
});

export default {
  [actions.setDatasets]: setDatasets,
  [actions.setDatasetsWithMetadata]: setDatasetsWithMetadata,
  [actions.setDatasetsLoading]: setDatasetsLoading,
};
