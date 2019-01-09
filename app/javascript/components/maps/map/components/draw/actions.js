import { createAction, createThunkAction } from 'redux-tools';
import { track } from 'app/analytics';

import { getGeostoreKey } from 'services/geostore';

export const setGeostoreId = createAction('setGeostoreId');
export const setDrawLoading = createAction('setDrawLoading');

export const getGeostoreId = createThunkAction(
  'getGeostoreId',
  geojson => (dispatch, getState) => {
    if (!getState().analysis.loading) {
      dispatch(setDrawLoading({ loading: true, error: false, geostoreId: '' }));
      getGeostoreKey(geojson)
        .then(geostore => {
          if (geostore && geostore.data && geostore.data.data) {
            const { id } = geostore.data.data;
            dispatch(setGeostoreId(id));
          }
        })
        .catch(error => {
          setDrawLoading({
            loading: false,
            error: true
          });
          console.info(error);
        });
    }
  }
);

export const setDrawnGeostore = createThunkAction(
  'setDrawnGeostore',
  geostoreId => (dispatch, getState) => {
    track('analysisDrawComplete');
    const { query, type } = getState().location;
    const { map } = query || {};
    dispatch({
      type,
      payload: {
        type: 'geostore',
        adm0: geostoreId
      },
      query: {
        ...query,
        map: {
          ...map,
          canBound: true,
          draw: false
        }
      }
    });
  }
);
