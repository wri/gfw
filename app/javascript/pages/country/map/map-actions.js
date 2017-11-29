import { createAction } from 'redux-actions';

const setMapIsLoading = createAction('setMapIsLoading');
const setMapZoom = createAction('setMapZoom');
const setLayers = createAction('setLayers');
const addLayer = createAction('addLayer');
const setLayerSpec = createAction('setLayerSpec');

export default {
  setMapIsLoading,
  setMapZoom,
  setLayers,
  addLayer,
  setLayerSpec
};
