import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';
import uniqBy from 'lodash/uniqBy';

import {
  getCountriesProvider,
  getFAOCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider,
  getCountryWhitelistProvider,
  getRegionWhitelistProvider
} from 'services/country';
import { getGeostoreProvider } from 'services/geostore';

export const setCountriesLoading = createAction('setCountriesLoading');
export const setRegionsLoading = createAction('setRegionsLoading');
export const setSubRegionsLoading = createAction('setSubRegionsLoading');
export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setCountryWhitelistLoading = createAction(
  'setCountryWhitelistLoading'
);
export const setRegionWhitelistLoading = createAction(
  'setRegionWhitelistLoading'
);

export const setCountries = createAction('setCountries');
export const setFAOCountries = createAction('setFAOCountries');
export const setGadmCountries = createAction('setGadmCountries');
export const setRegions = createAction('setRegions');
export const setSubRegions = createAction('setSubRegions');
export const setGeostore = createAction('setGeostore');
export const setCountryWhitelist = createAction('setCountryWhitelist');
export const setRegionWhitelist = createAction('setRegionWhitelist');

export const getCountries = createThunkAction(
  'getCountries',
  () => (dispatch, state) => {
    if (!state().countryData.isCountriesLoading) {
      dispatch(setCountriesLoading(true));
      axios
        .all([getCountriesProvider(), getFAOCountriesProvider()])
        .then(
          axios.spread((gadm28Countries, faoCountries) => {
            const countries = uniqBy(
              [...gadm28Countries.data.rows, ...faoCountries.data.rows],
              'iso'
            );
            dispatch(setGadmCountries(gadm28Countries.data.rows));
            dispatch(setFAOCountries(faoCountries.data.rows));
            dispatch(setCountries(countries));
            dispatch(setCountriesLoading(false));
          })
        )
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
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().countryData.isGeostoreLoading) {
      dispatch(setGeostoreLoading(true));
      getGeostoreProvider(country, region, subRegion)
        .then(response => {
          const { hash, areaHa, bbox } = response.data.data.attributes;
          dispatch(
            setGeostore({
              hash,
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

export const getCountryWhitelist = createThunkAction(
  'getCountryWhitelist',
  country => (dispatch, state) => {
    if (!state().countryData.isRegionWhitelistLoading) {
      dispatch(setCountryWhitelistLoading(true));
      getCountryWhitelistProvider(country)
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
          dispatch(setCountryWhitelist(data));
        })
        .catch(error => {
          dispatch(setCountryWhitelistLoading(false));
          console.info(error);
        });
    }
  }
);

export const getRegionWhitelist = createThunkAction(
  'getRegionWhitelist',
  (country, region, subRegion) => (dispatch, state) => {
    if (!state().countryData.isRegionWhitelistLoading) {
      dispatch(setRegionWhitelistLoading(true));
      getRegionWhitelistProvider(country, region, subRegion)
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
          dispatch(setRegionWhitelist(data));
        })
        .catch(error => {
          dispatch(setRegionWhitelistLoading(false));
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
