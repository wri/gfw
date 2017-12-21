export const initialState = {
  isLoading: false,
  data: {
    gain: 0,
    extent: 0
  },
  settings: {
    indicator: 'gadm28',
    threshold: '0'
  }
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

const setTreeCoverGainSettingsThreshold = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    threshold: payload
  }
});

export default {
  setTreeCoverGainIsLoading,
  setTreeCoverGainData,
  setTreeCoverGainSettingsIndicator,
  setTreeCoverGainSettingsThreshold
};
