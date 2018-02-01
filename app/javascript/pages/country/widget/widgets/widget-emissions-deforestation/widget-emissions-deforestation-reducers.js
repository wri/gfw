import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.emissionsDeforestation
};

const setEmissionsDeforestationData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...state.data,
    ...payload
  },
  settings: {
    ...state.settings,
    page: 0
  }
});

const setEmissionsDeforestationSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setEmissionsDeforestationLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setEmissionsDeforestationData,
  setEmissionsDeforestationSettings,
  setEmissionsDeforestationLoading
};
