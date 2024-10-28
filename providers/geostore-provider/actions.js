import { createAction, createThunkAction } from 'redux/actions';
import { getGeostore, saveGeostore } from 'services/geostore';

import { tropicsIntersection } from 'utils/intersections';

export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setGeostore = createAction('setGeostore');
export const clearGeostore = createAction('clearGeostore');

/**
 * Push the parameters from the area clicked to the URL query
 * @param {function} createThunkAction - A string with the area's  description
 * @see https://redux.js.org/usage/writing-logic-thunks for implementation details
 * @param {string} fetchGeostore - Action name
 * @param {function} - Arrow function
 * @param {object} params - Url query parameters
 */
export const fetchGeostore = createThunkAction(
  'fetchGeostore',
  (params) => (dispatch) => {
    const { type, adm0, adm1 = 25, adm2 = 390, token } = params;

    if (type && adm0) {
      dispatch(setGeostoreLoading({ loading: true, error: false }));
      getGeostore({ type, adm0, adm1, adm2, token })
        .then((geostore) => {
          if (geostore) {
            dispatch(setGeostore(tropicsIntersection(params, geostore)));
          }
        })
        .catch(() => {
          dispatch(setGeostoreLoading({ loading: false, error: true }));
        });
    }
  }
);

export const getGeostoreId = createThunkAction(
  'getGeostoreId',
  ({ geojson, callback }) =>
    (dispatch) => {
      if (geojson) {
        dispatch(setGeostoreLoading({ loading: true, error: false }));
        saveGeostore(geojson)
          .then((geostore) => {
            if (geostore && geostore.data && geostore.data.data) {
              const { id } = geostore.data.data;
              if (callback) {
                callback(id);
              } else {
                dispatch(setGeostoreLoading({ loading: false, error: false }));
              }
            }
          })
          .catch(() => {
            setGeostoreLoading({
              loading: false,
              error: true,
            });
          });
      }
    }
);
