import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.fires
};

const setFiresData = (state, { payload }) => ({
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

const setFiresSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setFiresLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setFiresData,
  setFiresSettings,
  setFiresLoading
};
