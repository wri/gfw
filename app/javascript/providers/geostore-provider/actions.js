import { createAction, createThunkAction } from 'redux-tools';
import {
  getGeostoreProvider,
  getGeostoreKey,
  getGeoDescriber
} from 'services/geostore';
import { getBoxBounds, getLeafletBbox } from 'utils/geoms';

export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setGeostore = createAction('setGeostore');
export const clearGeostore = createAction('clearGeostore');
export const setGeoDescriber = createAction('setGeoDescriber');

export const getGeostore = createThunkAction(
  'getGeostore',
  ({ type, adm0, adm1, adm2, token }) => (dispatch, getState) => {
    const { geostore } = getState();
    if (geostore && !geostore.loading) {
      dispatch(setGeostoreLoading({ loading: true, error: false }));
      getGeostoreProvider({ type, adm0, adm1, adm2, token })
        .then(response => {
          const { data } = response.data;
          if (data && data.attributes) {
            const { bbox, ...rest } = data.attributes || {};
            dispatch(
              setGeostore({
                id: data.id,
                ...rest,
                bbox: getLeafletBbox(bbox, adm0, adm1),
                bounds: getBoxBounds(bbox, adm0, adm1)
              })
            );
            if (type === 'geostore') {
              getGeoDescriber(rest.geojson).then(geodescriber => {
                dispatch(setGeoDescriber(geodescriber.data.data));
              });
            } else {
              dispatch(setGeostoreLoading({ loading: false, error: false }));
            }
          }
        })
        .catch(error => {
          dispatch(setGeostoreLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);

export const getGeostoreId = createThunkAction(
  'getGeostoreId',
  ({ geojson, callback }) => dispatch => {
    dispatch(setGeostoreLoading({ loading: true, error: false }));
    getGeostoreKey(geojson)
      .then(geostore => {
        if (geostore && geostore.data && geostore.data.data) {
          const { id } = geostore.data.data;
          dispatch(setGeostoreLoading({ loading: false, error: false }));
          if (callback) {
            callback(id);
          }
        }
      })
      .catch(error => {
        setGeostoreLoading({
          loading: false,
          error: true
        });
        console.info(error);
      });
  }
);
