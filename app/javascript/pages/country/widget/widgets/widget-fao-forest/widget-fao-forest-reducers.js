import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  isLoading: false,
  data: {
    fao: {},
    rank: 0
  },
  ...WIDGETS_CONFIG.faoForest
};

const setFAOForestIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setFAOForestData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    ...payload
  }
});

export default {
  setFAOForestIsLoading,
  setFAOForestData
};
