import { createAction, createThunkAction } from 'redux-tools';

import {
  getAdminGeostoreProvider,
  getGeostoreProvider
} from 'services/geostore';
import { getBoxBounds } from 'utils/geoms';

export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setGeostore = createAction('setGeostore');

export const getGeostore = createThunkAction(
  'getGeostore',
  ({ type, country, region, subRegion }) => (dispatch, state) => {
    if (!state().geostore.loading) {
      dispatch(setGeostoreLoading({ loading: true, error: false }));
      const geostoreFetchFunc =
        type && type !== 'country'
          ? getGeostoreProvider
          : getAdminGeostoreProvider;
      geostoreFetchFunc(country, region, subRegion)
        .then(response => {
          const { data } = response.data;
          if (data && data.attributes) {
            dispatch(
              setGeostore({
                id: data.id,
                ...data.attributes,
                bounds: getBoxBounds(data.attributes.bbox, country, region)
              })
            );
          }
          dispatch(setGeostoreLoading({ loading: false, error: false }));
        })
        .catch(error => {
          dispatch(setGeostoreLoading({ loading: false, error: true }));
          console.info(error);
        });
    }
  }
);
