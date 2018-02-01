import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.emissions
};

const setEmissionsData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    ...state.data,
    ...payload
  },
  settings: {
    ...state.settings,
    page: 0
  }
});

const setEmissionsSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setEmissionsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setEmissionsData,
  setEmissionsSettings,
  setEmissionsLoading
};
