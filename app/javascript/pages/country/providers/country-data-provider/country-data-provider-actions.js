import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider,
  getWhitelistProvider
} from 'services/country';
import { getGeostoreProvider } from 'services/geostore';

export const setCountriesLoading = createAction('setCountriesLoading');
export const setRegionsLoading = createAction('setRegionsLoading');
export const setSubRegionsLoading = createAction('setSubRegionsLoading');
export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setWhitelistLoading = createAction('setWhitelistLoading');

export const setCountries = createAction('setCountries');
export const setRegions = createAction('setRegions');
export const setSubRegions = createAction('setSubRegions');
export const setGeostore = createAction('setGeostore');
export const setWhitelist = createAction('setWhitelist');

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
          dispatch(setCountriesLoading(false));
          console.info(error);
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
          dispatch(setRegionsLoading(false));
          console.info(error);
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
          dispatch(setSubRegionsLoading(false));
          console.info(error);
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
          dispatch(setGeostoreLoading(false));
          console.info(error);
        });
    }
  }
);

export const getWhitelist = createThunkAction(
  'getWhitelist',
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().countryData.isWhitelistLoading) {
      dispatch(setWhitelistLoading(true));
      getWhitelistProvider(country, region, subRegion)
        .then(response => {
          const data = {};
          if (response.data && response.data.data.length) {
            response.data.data.forEach(d => {
              data[d.polyname] = {
                extent_2000: d.total_extent_2000,
                extent_2010: d.total_extent_2010,
                loss: d.total_loss,
                gain: d.total_gain
              };
            });
          }
          dispatch(setWhitelist(data));
        })
        .catch(error => {
          dispatch(setWhitelistLoading(false));
          console.info(error);
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
