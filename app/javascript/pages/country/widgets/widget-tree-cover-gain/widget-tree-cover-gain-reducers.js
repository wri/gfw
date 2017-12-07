export const initialState = {
  isLoading: false,
  gain: 0,
  treeExtent: 0,
  settings: {
    indicator: 'gadm28'
  }
};

const setTreeCoverGainIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeCoverGainValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  ...payload
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
  setTreeCoverGainValues,
  setTreeCoverGainSettingsIndicator
};
