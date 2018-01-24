import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.gainLocated
};

const setGainLocatedData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload,
  settings: {
    ...state.settings,
    page: 0
  }
});

const setGainLocatedPage = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    page: payload
  }
});

const setGainLocatedSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setGainLocatedLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setGainLocatedData,
  setGainLocatedPage,
  setGainLocatedSettings,
  setGainLocatedLoading
};
