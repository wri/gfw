import { createAction, createThunkAction } from 'vizzuality-redux-tools';

import { fetchLayerSpec } from 'services/layer-spec';

export const setLayerSpecLoading = createAction('setLayerSpecLoading');
export const setLayerSpec = createAction('setLayerSpec');
export const setMapOptions = createAction('setMapOptions');
export const setMapZoom = createAction('setMapZoom');
export const setShowMapMobile = createAction('setShowMapMobile');

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
        dispatch(setLayerSpec(layerSpec));
      })
      .catch(error => {
        console.info(error);
        dispatch(setLayerSpecLoading({ loading: false, error: true }));
      });
  }
);
