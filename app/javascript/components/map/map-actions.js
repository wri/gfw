import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { fetchLayerSpec } from 'services/layer-spec';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setMapSettings = createThunkAction(
  'setMapSettings',
  change => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'map',
        change,
        state
      })
    );
  }
);

// These action sync the url with the store. Not neccessary for now.

// const setMapState = createAction('setMapState');

// export const setMapUrlToStore = createThunkAction(
//   'setMapUrlToStore',
//   query => (dispatch, getState) => {
//     dispatch(setUrlStateToStore({
//       key: 'map',
//       query,
//       setState: setMapState,
//       getState
//     }));
//   }
// );

// soon to be depreciated
const setLayerSpecLoading = createAction('setLayerSpecLoading');
const setLayerSpec = createAction('setLayerSpec');
const getLayerSpec = createThunkAction('getLayerSpec', () => dispatch => {
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
});

export default {
  setLayerSpecLoading,
  setLayerSpec,
  getLayerSpec,
  setMapSettings
};
