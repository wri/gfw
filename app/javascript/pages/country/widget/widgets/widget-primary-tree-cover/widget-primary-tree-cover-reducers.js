import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.primaryTreeCover
};

const setPrimaryTreeCoverLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setPrimaryTreeCoverData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

const setPrimaryTreeCoverSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setPrimaryTreeCoverLoading,
  setPrimaryTreeCoverData,
  setPrimaryTreeCoverSettings
};
