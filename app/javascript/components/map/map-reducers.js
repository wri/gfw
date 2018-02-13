export const initialState = {
  loading: false,
  error: false,
  layerSpec: {},
  settings: {}
};

const setLayerSpecLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setLayerSpec = (state, { payload }) => ({
  ...state,
  layerSpec: payload,
  loading: false
});

export default {
  setLayerSpecLoading,
  setLayerSpec
};
