import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { getLayerSpec } from 'services/layer-spec';

const setLayersLoading = createAction('setLayersLoading');
const setLayers = createAction('setLayers');
const setLayersSpec = createAction('setLayersSpec');

const getLayersSpec = createThunkAction(
  'getLayersSpec',
  () => (dispatch, state) => {
    if (!state().map.setLayersLoading) {
      dispatch(setLayersLoading(true));
      getLayerSpec()
        .then(response => {
          const layersSpec = {};
          response.data.rows.forEach(layer => {
            layersSpec[layer.slug] = layer;
          });
          dispatch(setLayersSpec(layersSpec));
          dispatch(setLayersLoading(false));
        })
        .catch(error => {
          console.info(error);
          dispatch(setLayersLoading(false));
        });
    }
  }
);

export default {
  setLayersLoading,
  setLayers,
  setLayersSpec,
  getLayersSpec
};
