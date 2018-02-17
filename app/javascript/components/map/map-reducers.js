export const initialState = {
  loading: false,
  error: false,
  options: {},
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

const setMapOptions = (state, { payload }) => ({
  ...state,
  options: payload
});

const setMapZoom = (state, { payload }) => ({
  ...state,
  options: {
    ...state.options,
    zoom: payload
  }
});

const mapZoomIn = state => ({
  ...state,
  options: {
    ...state.options,
    zoom: state.options.zoom + 1 <= 20 ? state.options.zoom + 1 : 20
  }
});

const mapZoomOut = state => ({
  ...state,
  options: {
    ...state.options,
    zoom: state.options.zoom - 1 >= 1 ? state.options.zoom - 1 : 1
  }
});

export default {
  setLayerSpecLoading,
  setLayerSpec,
  setMapOptions,
  setMapZoom,
  mapZoomIn,
  mapZoomOut
};
