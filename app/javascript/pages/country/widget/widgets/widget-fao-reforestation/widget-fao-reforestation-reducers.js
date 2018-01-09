import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  data: {},
  ...WIDGETS_CONFIG.FAOReforestation
};

const setFAOReforestationLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

const setFAOReforestationData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...payload
  }
});

const setFAOReforestationSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setFAOReforestationLoading,
  setFAOReforestationData,
  setFAOReforestationSettings
};
