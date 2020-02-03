import { createAction, createThunkAction } from 'utils/redux';
import { getGeostoreProvider, getGeostoreKey } from 'services/geostore';
import { buildGeostore } from 'utils/geoms';

export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setGeostore = createAction('setGeostore');
export const clearGeostore = createAction('clearGeostore');

export const getGeostore = createThunkAction(
  'getGeostore',
  params => dispatch => {
    const { type, adm0, adm1, adm2, token } = params;
    dispatch(setGeostoreLoading({ loading: true, error: false }));
    getGeostoreProvider({ type, adm0, adm1, adm2, token })
      .then(response => {
        const { data } = response.data;
        if (data && data.attributes) {
          const geostore = buildGeostore(
            { id: data.id, ...data.attributes },
            params
          );
          dispatch(setGeostore(geostore));
        }
      })
      .catch(error => {
        dispatch(setGeostoreLoading({ loading: false, error: true }));
        console.info(error);
      });
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
