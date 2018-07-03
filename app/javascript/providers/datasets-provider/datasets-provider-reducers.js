export const initialState = {
  loading: false,
  error: false,
  data: []
};

const setDatasetsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setDatasetsData = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false
});

export default {
  setDatasetsData,
  setDatasetsLoading
};
