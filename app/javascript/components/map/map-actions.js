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
      dispatch(setLayerSpecLoading({ loading: true, error: false }));
      fetchLayerSpec()
        .then(response => {
          const layerSpec = {};
          (response.data.rows || []).forEach(layer => {
            layerSpec[layer.slug] = layer;
          });
          dispatch(setLayerSpec(layerSpec));
        })
        .catch(error => {
          console.info(error);
          dispatch(setLayerSpecLoading({ loading: false, error: true }));
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
