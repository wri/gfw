export const initialState = {
  zoom: 4,
  center: {
    latitude: 0,
    longitude: 20
  },
  layers: ['forest2000']
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

export default {
  setMapZoom,
  setLayer,
  addLayer
};
