import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider
} from 'services/country';
import { getGeostoreProvider } from 'services/geostore';

const setCountriesLoading = createAction('setCountriesLoading');
const setRegionsLoading = createAction('setRegionsLoading');
const setSubRegionsLoading = createAction('setSubRegionsLoading');
const setGeostoreLoading = createAction('setGeostoreLoading');

const setCountries = createAction('setCountries');
const setRegions = createAction('setRegions');
const setSubRegions = createAction('setSubRegions');
const setGeostore = createAction('setGeostore');

export const getCountries = createThunkAction(
  'getCountries',
  () => (dispatch, state) => {
    if (!state().countryData.isCountriesLoading) {
      dispatch(setCountriesLoading(true));
      getCountriesProvider()
        .then(response => {
          dispatch(setCountries(response.data.rows));
          dispatch(setCountriesLoading(false));
        })
        .catch(error => {
          console.info(error);
          dispatch(setCountriesLoading(false));
        });
    }
  }
);

export const getRegions = createThunkAction(
  'getRegions',
  country => (dispatch, state) => {
    if (!state().countryData.isRegionsLoading) {
      dispatch(setRegionsLoading(true));
      getRegionsProvider(country)
        .then(response => {
          dispatch(setRegions(response.data.rows));
          dispatch(setRegionsLoading(false));
        })
        .catch(error => {
          console.info(error);
          dispatch(setRegionsLoading(false));
        });
    }
  }
);

export const getSubRegions = createThunkAction(
  'getSubRegions',
  (country, region) => (dispatch, state) => {
    if (!state().countryData.isSubRegionsLoading) {
      dispatch(setSubRegionsLoading(true));
      getSubRegionsProvider(country, region)
        .then(response => {
          dispatch(setSubRegions(response.data.rows));
          dispatch(setSubRegionsLoading(false));
        })
        .catch(error => {
          console.info(error);
          dispatch(setSubRegionsLoading(false));
        });
    }
  }
);

export const getGeostore = createThunkAction(
  'getGeostore',
  (country, region) => (dispatch, state) => {
    if (!state().countryData.isGeostoreLoading) {
      dispatch(setGeostoreLoading(true));
      getGeostoreProvider(country, region)
        .then(response => {
          const { areaHa, bbox } = response.data.data.attributes;
          dispatch(
            setGeostore({
              areaHa,
              bounds: getBoxBounds(bbox)
            })
          );
          dispatch(setGeostoreLoading(false));
        })
        .catch(error => {
          console.info(error);
          dispatch(setGeostoreLoading(false));
        });
    }
  }
);

const getBoxBounds = cornerBounds => [
  [cornerBounds[0], cornerBounds[1]],
  [cornerBounds[0], cornerBounds[3]],
  [cornerBounds[2], cornerBounds[3]],
  [cornerBounds[2], cornerBounds[1]],
  [cornerBounds[0], cornerBounds[1]]
];
