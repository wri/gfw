import { createAction, createThunkAction } from 'redux-tools';

import { getGeostoreProvider } from 'services/geostore';
import { getBoxBounds, getLeafletBbox } from 'utils/geoms';

export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setGeostore = createAction('setGeostore');

export const getGeostore = createThunkAction(
  'getGeostore',
  ({ type, adm0, adm1, adm2 }) => (dispatch, state) => {
    if (!state().geostore.loading) {
      dispatch(setGeostoreLoading({ loading: true, error: false }));
      getGeostoreProvider({ type, adm0, adm1, adm2 })
        .then(response => {
          const { data } = response.data;
          if (data && data.attributes) {
            dispatch(
              setGeostore({
                id: data.id,
                ...data.attributes,
                bbox: getLeafletBbox(data.attributes.bbox, adm0, adm1),
                bounds: getBoxBounds(data.attributes.bbox, adm0, adm1)
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
