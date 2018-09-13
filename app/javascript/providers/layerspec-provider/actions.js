import { createAction, createThunkAction } from 'redux-tools';

import { fetchLayerSpec } from 'services/layer-spec';

export const setLayerSpecLoading = createAction('setLayerSpecLoading');
export const setLayers = createAction('setLayers');

export const getLayerSpec = createThunkAction(
  'getLayerSpec',
  () => dispatch => {
    dispatch(setLayerSpecLoading({ loading: true, error: false }));
    fetchLayerSpec()
      .then(response => {
        const layerSpec = {};
        (response.data.rows || []).forEach(layer => {
          layerSpec[layer.slug] = layer;
        });
        dispatch(setLayers(layerSpec) || []);
      })
      .catch(error => {
        dispatch(setLayerSpecLoading({ loading: false, error: true }));
        console.info(error);
      });
  }
);
