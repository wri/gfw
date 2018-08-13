import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getGeostoreProvider } from 'services/geostore';

export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setGeostore = createAction('setGeostore');

export const getGeostore = createThunkAction(
  'getGeostore',
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().geostore.loading) {
      dispatch(setGeostoreLoading(true));
      getGeostoreProvider(country, region, subRegion)
        .then(response => {
          const { data } = response.data;
          if (data && data.attributes) {
            dispatch(setGeostore({ ...data.attributes }));
          }
          dispatch(setGeostoreLoading(false));
        })
        .catch(error => {
          dispatch(setGeostoreLoading(false));
          console.info(error);
        });
    }
  }
);
