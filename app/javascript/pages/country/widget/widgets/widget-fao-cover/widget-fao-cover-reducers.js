import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  isLoading: false,
  data: {
    fao: {},
    rank: 0
  },
  ...WIDGETS_CONFIG.faoCover
};

const setFAOCoverIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setFAOCoverData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    ...payload
  }
});

export default {
  setFAOCoverIsLoading,
  setFAOCoverData
};
