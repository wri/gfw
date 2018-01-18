import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    loss: [],
    extent: 0
  },
  ...WIDGETS_CONFIG.treeLossPlantations
};

export const setTreeLossPlantationsData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

export const setTreeLossPlantationsSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export const setTreeLossPlantationsLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setTreeLossPlantationsData,
  setTreeLossPlantationsSettings,
  setTreeLossPlantationsLoading
};
