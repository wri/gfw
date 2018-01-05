import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  isLoading: false,
  data: {
    loss: [],
    extent: 0
  },
  ...WIDGETS_CONFIG.treeLoss
};

const setTreeLossValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    loss: payload.loss,
    extent: payload.extent
  },
  settings: {
    ...state.settings,
    startYear: payload.startYear,
    endYear: payload.endYear
  }
});

const setTreeLossSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
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
  setTreeLossSettings,
  setTreeLossSettingsThreshold,
  setTreeLossIsLoading,
  setTreeLossSettingsStartYear,
  setTreeLossSettingsEndYear
};
