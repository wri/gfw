import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  data: {
    gain: 0,
    extent: 0
  },
  ...WIDGETS_CONFIG.treeGain
};

const setTreeGainLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

const setTreeGainData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...payload
  }
});

const setTreeGainSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setTreeGainLoading,
  setTreeGainData,
  setTreeGainSettings
};
