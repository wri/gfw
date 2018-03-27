import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    loss: [],
    extent: []
  },
  ...WIDGETS_CONFIG.gladBiodiversity
};

const setGladBiodiversityData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload,
  settings: {
    ...state.settings,
    page: 0
  }
});

const setGladBiodiversityPage = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    page: payload
  }
});

const setGladBiodiversitySettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setGladBiodiversityLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setGladBiodiversityData,
  setGladBiodiversityPage,
  setGladBiodiversitySettings,
  setGladBiodiversityLoading
};
