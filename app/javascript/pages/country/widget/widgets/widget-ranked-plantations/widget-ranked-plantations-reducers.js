import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    extent: [],
    plantations: []
  },
  ...WIDGETS_CONFIG.rankedPlantations
};

export const setRankedPlantationsData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

export const setRankedPlantationsSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export const setRankedPlantationsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setRankedPlantationsPage = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    page: payload
  }
});

export default {
  setRankedPlantationsData,
  setRankedPlantationsSettings,
  setRankedPlantationsLoading,
  setRankedPlantationsPage
};
