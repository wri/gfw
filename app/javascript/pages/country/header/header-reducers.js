export const initialState = {
  isExtentLoading: false,
  isPlantationsLossLoading: false,
  isTotalLossLoading: false,
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

const setExtentLoading = (state, { payload }) => ({
  ...state,
  isExtentLoading: payload
});

const setPlantationsLossLoading = (state, { payload }) => ({
  ...state,
  isPlantationsLossLoading: payload
});

const setTotalLossLoading = (state, { payload }) => ({
  ...state,
  isTotalLossLoading: payload
});

const setTotalExtent = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  },
  isExtentLoading: false
});

const setTotalLoss = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    totalLoss: payload
  },
  isTotalLossLoading: false
});

const setPlantationsLoss = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    plantationsLoss: payload
  },
  isPlantationsLossLoading: false
});

export default {
  setExtentLoading,
  setPlantationsLossLoading,
  setTotalLossLoading,
  setTotalExtent,
  setTotalLoss,
  setPlantationsLoss
};
