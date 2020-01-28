import { createThunkAction, createAction } from 'utils/redux';

import { fetchPlanetBasemaps } from 'services/planet';

export const setBasemapsLoading = createAction('setBasemapsLoading');
export const setBasemapsData = createAction('setBasemapsData');

export const getPlanetBasemaps = createThunkAction(
  'getPlanetBasemaps',
  () => (dispatch, state) => {
    const { basemaps } = state() || {};
    if (basemaps && !basemaps.loading) {
      dispatch(setBasemapsLoading({ loading: true, error: false }));
      fetchPlanetBasemaps()
        .then(response => {
          const { mosaics } = (response && response.data) || {};
          dispatch(setBasemapsData({ planet: mosaics }));
        })
        .catch(error => {
          console.info(error);
          dispatch(setBasemapsLoading({ loading: false, error: true }));
        });
    }
  }
);
