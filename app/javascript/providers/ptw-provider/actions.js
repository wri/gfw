import { createAction, createThunkAction } from 'redux-tools';
import uniqBy from 'lodash/uniqBy';
import { reverseLatLng } from 'utils/geoms';

import { getPTWProvider } from 'services/places-to-watch';

export const setPTWLoading = createAction('setPTWLoading');
export const setPTW = createAction('setPTW');

export const getPTW = createThunkAction(
  'getPTW',
  () => (dispatch, getState) => {
    const { ptw } = getState();
    if (ptw && !ptw.loading) {
      dispatch(setPTWLoading(true));
      getPTWProvider()
        .then(response => {
          const { rows } = response.data;
          if (rows && !!rows.length) {
            const ptwResponse = uniqBy(rows, 'cartodb_id')
              .filter(d => d.bbox)
              .map(p => {
                const bbox = JSON.parse(p.bbox);

                return {
                  ...p,
                  bbox: reverseLatLng(bbox.coordinates[0])
                };
              });
            dispatch(setPTW(uniqBy(ptwResponse, 'cartodb_id')));
          }
          dispatch(setPTWLoading(false));
        })
        .catch(error => {
          dispatch(setPTWLoading(false));
          console.info(error);
        });
    }
  }
);
