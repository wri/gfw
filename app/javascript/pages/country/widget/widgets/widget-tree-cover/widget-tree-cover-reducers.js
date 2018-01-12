import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.treeCover
};

const setTreeCoverLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setTreeCoverData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...state.data,
    ...payload
  }
});

const setTreeCoverSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setTreeCoverLoading,
  setTreeCoverData,
  setTreeCoverSettings
};
