import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { fetchLayerSpec } from 'services/layer-spec';
import { setComponentStateToUrl, setUrlStateToStore } from 'utils/stateToUrl';

const setLayerSpecLoading = createAction('setLayerSpecLoading');
const setLayerSpec = createAction('setLayerSpec');

// map state url actions
const setMapState = createAction('setMapState');

export const setMapSettings = createThunkAction(
  'setMapSettings',
  change => (dispatch, state) => {
    setComponentStateToUrl({
      key: 'map',
      change,
      state,
      dispatch
    });
  }
);

export const setMapUrlToStore = createThunkAction(
  'setMapUrlToStore',
  query => (dispatch, getState) => {
    setUrlStateToStore({
      key: 'map',
      query,
      setState: setMapState,
      dispatch,
      getState
    });
  }
);

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
  setMapState,
  setMapUrlToStore,
  getLayerSpec,
  setMapSettings
};
