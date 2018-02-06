import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    fao: [],
    rank: []
  },
  ...WIDGETS_CONFIG.FAODeforestation
};

const setFAODeforestationLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setFAODeforestationData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...state.data,
    ...payload
  }
});

const setFAODeforestationSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setFAODeforestationLoading,
  setFAODeforestationData,
  setFAODeforestationSettings
};
