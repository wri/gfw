import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    regions: []
  },
  ...WIDGETS_CONFIG.treeLocated
};

const setTreeLocatedData = (state, { payload }) => ({
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

const setTreeLocatedPage = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    page: payload
  }
});

const setTreeLocatedSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setTreeLocatedLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setTreeLocatedData,
  setTreeLocatedPage,
  setTreeLocatedSettings,
  setTreeLocatedLoading
};
