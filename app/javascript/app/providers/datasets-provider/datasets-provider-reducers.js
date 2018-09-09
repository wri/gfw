export const initialState = {
  loading: false,
  error: false,
  datasets: []
};

const setDatasetsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setDatasets = (state, { payload }) => ({
  ...state,
  datasets: payload,
  loading: false
});

export default {
  setDatasets,
  setDatasetsLoading
};
