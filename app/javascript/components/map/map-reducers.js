export const initialState = {
  isLoading: true,
  layerSpec: {},
  layers: ['forest2000', 'ifl_2013_deg']
};

const setLayerSpecLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setLayerSpec = (state, { payload }) => ({
  ...state,
  layerSpec: payload
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
