export const initialState = {
  loading: true,
  error: false,
  layerSpec: {},
  settings: {
    mapTypeId: 'GFWdefault',
    backgroundColor: '#A4DBFD',
    disableDefaultUI: true,
    panControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    overviewMapControl: false,
    tilt: 0,
    center: { lat: 15.0, lng: 27.0 },
    zoom: 3,
    minZoom: 2,
    maxZoom: 14,
    layers: ['forest2000'],
    adm0: null,
    adm1: null,
    adm2: null,
    showMapMobile: false,
    threshold: 30
  }
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
  settings: {
    ...state.settings,
    ...payload
  }
});

const setMapState = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

const setShowMapMobile = (state, { payload }) => ({
  ...state,
  showMapMobile: payload
});

const setMapZoom = (state, { payload }) => {
  const { maxZoom, minZoom, zoom } = state.settings;
  const { value, sum } = payload;
  let newZoom = sum ? zoom + sum : value;
  if (zoom > maxZoom) {
    newZoom = minZoom;
  } else if (zoom < minZoom) {
    newZoom = minZoom;
  }

  return {
    ...state,
    settings: {
      ...state.settings,
      zoom: newZoom
    }
  };
};

export default {
  setLayerSpecLoading,
  setLayerSpec,
  setMapSettings,
  setMapZoom,
  setShowMapMobile,
  setMapState
};
