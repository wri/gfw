import * as actions from './actions';

export const initialState = {
  loading: true,
  error: false,
  layerSpec: {},
  options: {
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
    scrollwheel: false,
    center: { lat: 15, lng: 27 },
    zoom: 2,
    minZoom: 2,
    maxZoom: 14
  },
  settings: {},
  showMapMobile: false
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

const setShowMapMobile = (state, { payload }) => ({
  ...state,
  showMapMobile: payload
});

const setMapZoom = (state, { payload }) => {
  const { maxZoom, minZoom, zoom } = state.options;
  const { value, sum } = payload;
  let newZoom = sum ? zoom + sum : value;
  if (zoom > maxZoom) {
    newZoom = minZoom;
  } else if (zoom < minZoom) {
    newZoom = minZoom;
  }

  return {
    ...state,
    options: {
      ...state.options,
      zoom: newZoom
    }
  };
};

export default {
  [actions.setLayerSpecLoading]: setLayerSpecLoading,
  [actions.setLayerSpec]: setLayerSpec,
  [actions.setMapOptions]: setMapOptions,
  [actions.setMapZoom]: setMapZoom,
  [actions.setShowMapMobile]: setShowMapMobile
};
