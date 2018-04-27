import WIDGETS_CONFIG from '../../widget-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    loss: [],
    extent: []
  },
  ...WIDGETS_CONFIG.lossLocated
};

const setLossLocatedData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload,
  settings: {
    ...state.settings,
    page: 0
  }
});

const setLossLocatedPage = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    page: payload
  }
});

const setLossLocatedSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setLossLocatedLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setLossLocatedData,
  setLossLocatedPage,
  setLossLocatedSettings,
  setLossLocatedLoading
};
