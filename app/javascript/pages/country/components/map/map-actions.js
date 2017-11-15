import { createAction } from 'redux-actions';

const setMapZoom = createAction('setMapZoom');
const setLayers = createAction('setLayers');
const addLayer = createAction('addLayer');
const setLayerSpec = createAction('setLayerSpec');

export default {
  setMapZoom,
  setLayers,
  addLayer,
  setLayerSpec
};
