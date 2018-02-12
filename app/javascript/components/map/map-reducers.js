export const initialState = {
  loading: false,
  error: false,
  layerSpec: {},
  layers: [],
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

const setLayers = (state, { payload }) => ({
  ...state,
  layers: payload.clear ? payload.layers : [...state.layers, ...payload.layers],
  settings: payload.settings
});

export default {
  setLayerSpecLoading,
  setLayerSpec,
  setLayers
};
