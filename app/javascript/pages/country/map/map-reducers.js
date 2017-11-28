export const initialState = {
  isLoading: true,
  zoom: 4,
  maptype: 'grayscale',
  layerSpec: {},
  layers: ['forest2000', 'ifl_2013_deg']
};

const setMapIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setMapZoom = (state, { payload }) => ({
  ...state,
  zoom: payload
});

const setLayers = (state, { payload }) => ({
  ...state,
  layers: payload
});

const addLayer = (state, { payload }) => ({
  ...state,
  layers: [...state.layers, payload]
});

const setLayerSpec = (state, { payload }) => ({
  ...state,
  layerSpec: payload
});

export default {
  setMapIsLoading,
  setMapZoom,
  setLayers,
  addLayer,
  setLayerSpec
};
