import { createAction, createThunkAction } from 'redux-tools';
import uniqBy from 'lodash/uniqBy';
import { reverseLatLng } from 'utils/geoms';

import { getPTWProvider } from 'services/places-to-watch';

export const setPTWLoading = createAction('setPTWLoading');
export const setPTW = createAction('setPTW');

export const getPTW = createThunkAction('getPTW', () => (dispatch, state) => {
  if (!state().ptw.loading) {
    dispatch(setPTWLoading(true));
    getPTWProvider()
      .then(response => {
        const { rows } = response.data;
        if (rows && !!rows.length) {
          const ptw = uniqBy(rows, 'cartodb_id').map(p => ({
            ...p,
            bbox: reverseLatLng(JSON.parse(p.bbox).coordinates[0])
          }));
          dispatch(setPTW(uniqBy(ptw, 'cartodb_id')));
        }
        dispatch(setPTWLoading(false));
      })
      .catch(error => {
        dispatch(setPTWLoading(false));
        console.info(error);
      });
  }
});
