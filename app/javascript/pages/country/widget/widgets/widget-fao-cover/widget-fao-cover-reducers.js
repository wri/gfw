import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    fao: {},
    rank: 0
  },
  ...WIDGETS_CONFIG.FAOCover
};

const setFAOCoverLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setFAOCoverData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...payload
  }
});

export default {
  setFAOCoverLoading,
  setFAOCoverData
};
