import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getGeostoreProvider } from 'services/geostore';

import BOUNDS from 'data/bounds.json';

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
            dispatch(
              setGeostore({
                id: data.id,
                ...data.attributes,
                bounds: getBoxBounds(data.attributes.bbox, country, region)
              })
            );
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

const getBoxBounds = (cornerBounds, country, region) => {
  if (!region && Object.keys(BOUNDS).includes(country)) {
    return BOUNDS[country];
  }
  return [
    [cornerBounds[0], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[1]]
  ];
};
