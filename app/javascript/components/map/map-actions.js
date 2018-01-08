import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { fetchLayerSpec } from 'services/layer-spec';

const setLayerSpecLoading = createAction('setLayerSpecLoading');
const setLayerSpec = createAction('setLayerSpec');
const setLayers = createAction('setLayers');

const getLayerSpec = createThunkAction(
  'getLayerSpec',
  () => (dispatch, state) => {
    if (!state().map.setLayersLoading) {
      dispatch(setLayerSpecLoading(true));
      fetchLayerSpec()
        .then(response => {
          const layerSpec = {};
          (response.data.rows || []).forEach(layer => {
            layerSpec[layer.slug] = layer;
          });
          dispatch(setLayerSpec(layerSpec));
          dispatch(setLayerSpecLoading(false));
        })
        .catch(error => {
          console.info(error);
          dispatch(setLayerSpecLoading(false));
        });
    }
  }
);

export default {
  setLayerSpecLoading,
  setLayerSpec,
  getLayerSpec,
  setLayers
};
