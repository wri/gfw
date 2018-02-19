import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import axios from 'axios';
import uniqBy from 'lodash/uniqBy';

import {
  getCountriesProvider,
  getFAOCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider,
  getCountryLinksProvider
} from 'services/country';
import { getGeostoreProvider } from 'services/geostore';

export const setCountriesLoading = createAction('setCountriesLoading');
export const setRegionsLoading = createAction('setRegionsLoading');
export const setSubRegionsLoading = createAction('setSubRegionsLoading');
export const setGeostoreLoading = createAction('setGeostoreLoading');
export const setCountryLinksLoading = createAction('setCountryLinksLoading');

export const setCountries = createAction('setCountries');
export const setFAOCountries = createAction('setFAOCountries');
export const setGadmCountries = createAction('setGadmCountries');
export const setRegions = createAction('setRegions');
export const setSubRegions = createAction('setSubRegions');
export const setGeostore = createAction('setGeostore');
export const setCountryLinks = createAction('setCountryLinks');

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
          const { hash, areaHa, bbox, geojson } = response.data.data.attributes;
          dispatch(
            setGeostore({
              hash,
              geojson,
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

export const getCountryLinks = createThunkAction(
  'getCountryLinks',
  () => (dispatch, state) => {
    if (!state().countryData.isCountryLinksLoading) {
      dispatch(setCountryLinksLoading(true));
      getCountryLinksProvider()
        .then(response => {
          const data = {};
          if (response.data && response.data.rows.length) {
            response.data.rows.forEach(d => {
              data[d.iso] = JSON.parse(d.external_links);
            });
          }
          dispatch(setCountryLinks(data));
        })
        .catch(error => {
          dispatch(setCountryLinksLoading(false));
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
