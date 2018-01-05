import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  data: {
    loss: [],
    extent: 0
  },
  ...WIDGETS_CONFIG.treeLoss
};

const setTreeLossData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: {
    loss: payload.loss,
    extent: payload.extent
  },
  settings: {
    ...state.settings,
    startYear: payload.startYear,
    endYear: payload.endYear
  }
});

const setTreeLossSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setTreeLossLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  setTreeLossData,
  setTreeLossSettings,
  setTreeLossLoading
};
