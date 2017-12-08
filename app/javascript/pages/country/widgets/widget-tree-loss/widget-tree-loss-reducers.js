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
    canopy: 30
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

const setTreeLossSettingsCanopy = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    canopy: payload
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
  setTreeLossSettingsCanopy,
  setTreeLossIsLoading,
  setTreeLossSettingsStartYear,
  setTreeLossSettingsEndYear
};
