import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    loss: []
  },
  ...WIDGETS_CONFIG.lossRanked
};

const setLossRankedLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setLossRankedData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...payload
  }
});

const setLossRankedSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setLossRankedLoading,
  setLossRankedData,
  setLossRankedSettings
};
