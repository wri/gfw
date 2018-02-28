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

const setMapSettings = (state, { payload }) => ({
  ...state,
  options: payload
});

const setMapZoom = (state, { payload }) => {
  let zoom = !payload.sum ? payload.value : state.options.zoom + payload.value;
  if (zoom > 20) {
    zoom = 20;
  } else if (zoom < 1) {
    zoom = 1;
  }

  return {
    ...state,
    options: {
      ...state.options,
      zoom
    }
  };
};

export default {
  setLayerSpecLoading,
  setLayerSpec,
  setMapSettings,
  setMapZoom
};
