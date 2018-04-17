import WIDGETS_CONFIG from '../../widget-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {
    loss: [],
    extent: 0
  },
  ...WIDGETS_CONFIG.treeLoss
};

export const setTreeLossData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload
});

export const setTreeLossSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export const setTreeLossLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setTreeLossData,
  setTreeLossSettings,
  setTreeLossLoading
};
