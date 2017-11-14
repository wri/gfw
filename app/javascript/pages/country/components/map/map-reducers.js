export const initialState = {
  zoom: 4,
  maptype: 'grayscale',
  layerSpec: [],
  layers: ['forest2000'],
};

const setMapZoom = (state, { payload }) => ({
  ...state,
  zoom: payload
});

const setLayer = (state, { payload }) => ({
  ...state,
  layers: [payload]
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
  setMapZoom,
  setLayer,
  addLayer,
  setLayerSpec
};
