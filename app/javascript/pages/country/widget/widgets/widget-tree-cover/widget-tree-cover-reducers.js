export const initialState = {
  isLoading: false,
  data: {
    totalArea: 0,
    cover: 0,
    plantations: 0
  },
  settings: {
    indicator: 'gadm28',
    threshold: 30
  }
};

const setTreeCoverLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeCoverData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    ...payload
  }
});

const setTreeCoverSettingsIndicator = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    indicator: payload
  }
});

const setTreeCoverSettingsThreshold = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    threshold: payload
  }
});

export default {
  setTreeCoverLoading,
  setTreeCoverData,
  setTreeCoverSettingsIndicator,
  setTreeCoverSettingsThreshold
};
