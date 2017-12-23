import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  isLoading: false,
  data: {},
  ...WIDGETS_CONFIG.faoReforestation
};

const setFAOReforestationIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setFAOReforestationData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    ...payload
  }
});

const setFAOReforestationSettingsPeriod = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    period: payload
  }
});

export default {
  setFAOReforestationIsLoading,
  setFAOReforestationData,
  setFAOReforestationSettingsPeriod
};
