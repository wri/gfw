import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  isLoading: false,
  data: {},
  ...WIDGETS_CONFIG.faoExtent
};

const setFAOExtentIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setFAOExtentData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    ...payload
  }
});

const setFAOExtentSettingsPeriod = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    period: payload
  }
});

export default {
  setFAOExtentIsLoading,
  setFAOExtentData,
  setFAOExtentSettingsPeriod
};
