import { createAction, createThunkAction } from 'vizzuality-redux-tools';
import { getGeostoreProvider } from 'services/geostore';
import { getBoxBounds, getLeafletBbox } from 'utils/geoms';

export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setGeostore = createAction('setGeostore');

export const getGeostore = createThunkAction(
  'getGeostore',
  ({ type, adm0, adm1, adm2, token }) => (dispatch, state) => {
    if (!state().geostore.loading) {
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
