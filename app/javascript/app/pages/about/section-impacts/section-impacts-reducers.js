export const initialState = {
  loading: false,
  error: false,
  search: '',
  data: []
};

const setImpactsProjectsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setImpactsProjectsData = (state, { payload }) => ({
  ...state,
  data: payload
});

export default {
  setImpactsProjectsLoading,
  setImpactsProjectsData
};
