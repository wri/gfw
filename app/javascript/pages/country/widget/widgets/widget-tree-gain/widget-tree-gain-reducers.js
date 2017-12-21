import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  isLoading: false,
  data: {
    gain: 0,
    extent: 0
  },
  ...WIDGETS_CONFIG.treeGain
};

const setTreeCoverGainIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeCoverGainData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    ...payload
  }
});

const setTreeCoverGainSettingsIndicator = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    indicator: payload
  }
});

export default {
  setTreeCoverGainIsLoading,
  setTreeCoverGainData,
  setTreeCoverGainSettingsIndicator
};
