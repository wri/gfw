import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.gladRanked
};

const setGladRankedData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload,
  settings: {
    ...state.settings,
    page: 0
  }
});

const setGladRankedPage = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    page: payload
  }
});

const setGladRankedSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setGladRankedLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setGladRankedData,
  setGladRankedPage,
  setGladRankedSettings,
  setGladRankedLoading
};
