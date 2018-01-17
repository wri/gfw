import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.intactTreeCover
};

const setIntactTreeCoverLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setIntactTreeCoverData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

const setIntactTreeCoverSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setIntactTreeCoverLoading,
  setIntactTreeCoverData,
  setIntactTreeCoverSettings
};
