import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.forestryEmployment
};

const setForestryEmploymentLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setForestryEmploymentData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

const setForestryEmploymentSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setForestryEmploymentLoading,
  setForestryEmploymentData,
  setForestryEmploymentSettings
};
