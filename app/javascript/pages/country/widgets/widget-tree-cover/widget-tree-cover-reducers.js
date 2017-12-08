export const initialState = {
  isLoading: false,
  data: {
    totalArea: 0,
    totalCover: 0,
    totalIntactForest: 0,
    totalNonForest: 0
  },
  settings: {
    indicator: 'gadm28',
    unit: 'ha',
    threshold: 30
  }
};

const setTreeCoverLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeCoverData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    ...payload
  }
});

const setTreeCoverSettingsIndicator = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    indicator: payload
  }
});

const setTreeCoverSettingsUnit = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    unit: payload
  }
});

const setTreeCoverSettingsThreshold = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    threshold: payload
  }
});

export default {
  setTreeCoverLoading,
  setTreeCoverData,
  setTreeCoverSettingsIndicator,
  setTreeCoverSettingsUnit,
  setTreeCoverSettingsThreshold
};
