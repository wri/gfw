export const initialState = {
  loading: false,
  error: false,
  layerSpec: {},
  layers: ['umd_as_it_happens']
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
  layers: payload
});

export default {
  setLayerSpecLoading,
  setLayerSpec,
  setLayers
};
