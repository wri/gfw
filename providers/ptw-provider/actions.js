import { createAction, createThunkAction } from 'redux/actions';
import uniqBy from 'lodash/uniqBy';
import { reverseLatLng } from 'utils/geoms';

import { getPlacesToWatch } from 'services/places-to-watch';

export const setPTWLoading = createAction('setPTWLoading');
export const setPTW = createAction('setPTW');

export const getPTW = createThunkAction(
  'getPTW',
  () => (dispatch, getState) => {
    const { ptw } = getState();
    if (ptw && !ptw.loading) {
      dispatch(setPTWLoading(true));
      getPlacesToWatch()
        .then((response) => {
          if (response && !!response.length) {
            const ptwResponse = uniqBy(response, 'ptw_id')
              .filter((d) => d.bbox)
              .map((p) => {
                const bbox = JSON.parse(p.bbox);

                return {
                  ...p,
                  bbox: reverseLatLng(bbox.coordinates[0]),
                };
              });
            dispatch(setPTW(uniqBy(ptwResponse, 'ptw_id')));
          }
          dispatch(setPTWLoading(false));
        })
        .catch(() => {
          dispatch(setPTWLoading(false));
        });
    }
  }
);
