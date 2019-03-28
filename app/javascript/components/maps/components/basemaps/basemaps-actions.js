import { createThunkAction, createAction } from 'redux-tools';

import { fetchPlanetBasemaps } from 'services/planet';

export const setBasemapsLoading = createAction('setBasemapsLoading');
export const setBasemapsData = createAction('setBasemapsData');

export const getPlanetBasemaps = createThunkAction(
  'getPlanetBasemaps',
  () => (dispatch, state) => {
    const { basemaps } = state() || {};
    if (basemaps && !basemaps.loading) {
      fetchPlanetBasemaps().then(response => {
        const { mosaics } = (response && response.data) || {};
        dispatch(setBasemapsData({ planet: mosaics }));
      });
    }
  }
);
