import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  data: {
    totalArea: 0,
    cover: 0,
    plantations: 0
  },
  ...WIDGETS_CONFIG.treeCover
};

const setTreeCoverLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

const setTreeCoverData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
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
