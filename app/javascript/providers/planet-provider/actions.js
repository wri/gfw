import { createAction, createThunkAction } from 'utils/redux';

import { fetchPlanetBasemaps } from 'services/planet';

export const setPlanetBasemapsLoading = createAction(
  'setPlanetBasemapsLoading'
);
export const setPlanetBasemaps = createAction('setPlanetBasemaps');

export const getPlanetBasemaps = createThunkAction(
  'getPlanetBasemaps',
  () => dispatch => {
    dispatch(setPlanetBasemapsLoading(true));
    fetchPlanetBasemaps()
      .then(response => {
        const { mosaics } = response.data || {};
        if (mosaics) {
          dispatch(setPlanetBasemaps(mosaics));
        }
        dispatch(setPlanetBasemapsLoading(false));
      })
      .catch(error => {
        dispatch(setPlanetBasemapsLoading(false));
        console.info(error);
      });
  }
);
