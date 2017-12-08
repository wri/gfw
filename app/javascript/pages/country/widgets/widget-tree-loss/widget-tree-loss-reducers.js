export const initialState = {
  isLoading: false,
  data: {
    loss: [],
    extent: 0
  },
  settings: {
    startYear: 2001,
    endYear: 2016,
    indicator: 'gadm28',
    threshold: 30
  }
};

const setTreeLossValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  ...payload
});

const setTreeLossSettingsIndicator = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    indicator: payload
  }
});

const setTreeLossSettingsThreshold = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    threshold: payload
  }
});

const setTreeLossIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeLossSettingsStartYear = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    startYear: payload
  }
});

const setTreeLossSettingsEndYear = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    endYear: payload
  }
});

export default {
  setTreeLossValues,
  setTreeLossSettingsIndicator,
  setTreeLossSettingsThreshold,
  setTreeLossIsLoading,
  setTreeLossSettingsStartYear,
  setTreeLossSettingsEndYear
};
