import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    extent: []
  },
  ...WIDGETS_CONFIG.treeCoverRanked
};

const setTreeCoverRankedLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setTreeCoverRankedData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...payload
  }
});

const setTreeCoverRankedSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setTreeCoverRankedLoading,
  setTreeCoverRankedData,
  setTreeCoverRankedSettings
};
