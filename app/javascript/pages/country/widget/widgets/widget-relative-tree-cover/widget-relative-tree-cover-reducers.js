import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    regions: []
  },
  ...WIDGETS_CONFIG.relativeTreeCover
};

const setRelativeTreeCoverData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    regions: payload
  },
  settings: {
    ...state.settings,
    page: 0
  }
});

const setRelativeTreeCoverPage = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    page: payload
  }
});

const setRelativeTreeCoverSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setRelativeTreeCoverLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setRelativeTreeCoverData,
  setRelativeTreeCoverPage,
  setRelativeTreeCoverSettings,
  setRelativeTreeCoverLoading
};
