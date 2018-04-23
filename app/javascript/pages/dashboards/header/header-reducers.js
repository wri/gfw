export const initialState = {
  loading: false,
  error: false,
  data: {
    totalArea: 0,
    extent: 0,
    totalLoss: {},
    plantationsLoss: {}
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30
  }
};

const setHeaderLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setHeaderData = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  },
  loading: false
});

export default {
  setHeaderLoading,
  setHeaderData
};
