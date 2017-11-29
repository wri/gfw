import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getLayerSpec } from 'services/layer-spec';

const setLayersLoading = createAction('setLayersLoading');
const setMapZoom = createAction('setMapZoom');
const setLayers = createAction('setLayers');
const addLayer = createAction('addLayer');
const setLayerSpec = createAction('setLayerSpec');

const getLayers = createThunkAction('getLayers', () => (dispatch, state) => {
  if (!state().map.setLayersLoading) {
    dispatch(setLayersLoading(true));
    getLayerSpec().then(response => {
      const layerSpec = {};
      response.data.rows.forEach(layer => {
        layerSpec[layer.slug] = layer;
      });
      dispatch(setLayerSpec(layerSpec));
      dispatch(setLayersLoading(false));
    });
  }
});

export default {
  setLayersLoading,
  setMapZoom,
  setLayers,
  addLayer,
  setLayerSpec,
  getLayers
};
