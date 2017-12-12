export const initialState = {
  isExtentLoading: false,
  isPlantationsLossLoading: false,
  isTotalLossLoading: false,
  data: {
    countryArea: 0,
    regionArea: 0,
    subRegionArea: 0,
    extent: 0,
    totalLoss: 0,
    plantationsLoss: 0
  },
  settings: {
    indicator: 'gadm23',
    threshold: 30
  }
};

const setExtentLoading = (state, { payload }) => ({
  ...state,
  setExtentLoading: payload
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
