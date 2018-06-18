import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { parseGadm36Id } from 'utils/format';
import axios from 'axios';
import uniqBy from 'lodash/uniqBy';

import {
  getCountriesProvider,
  getFAOCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider,
  getCountryLinksProvider
} from 'services/country';
import { getWaterBodiesBlacklistProvider } from 'services/whitelists';

import { getGeostoreProvider } from 'services/geostore';
import BOUNDS from 'data/bounds.json';

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
  () => dispatch => {
    dispatch(setCountriesLoading(true));
    axios
      .all([getCountriesProvider(), getFAOCountriesProvider()])
      .then(
        axios.spread((gadm28Countries, faoCountries) => {
          dispatch(setGadmCountries(gadm28Countries.data.rows));
          dispatch(setFAOCountries(faoCountries.data.rows));
          dispatch(setCountries(gadm28Countries.data.rows));
          dispatch(setCountriesLoading(false));
        })
      )
      .catch(error => {
        dispatch(setCountriesLoading(false));
        console.info(error);
      });
  }
);

export const getRegions = createThunkAction(
  'getRegions',
  country => (dispatch, state) => {
    if (!state().countryData.isRegionsLoading) {
      dispatch(setRegionsLoading(true));
      getRegionsProvider(country)
        .then(response => {
          const parsedResponse = [];
          uniqBy(response.data.rows).forEach(row => {
            parsedResponse.push({
              id: parseGadm36Id(row.id).adm1,
              name: row.name
            });
          });
          dispatch(setRegions(parsedResponse, 'id'));
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
      axios
        .all([
          getSubRegionsProvider(country, region),
          getWaterBodiesBlacklistProvider(country, region)
        ])
        .then(
          axios.spread((subRegions, blacklistResponse) => {
            const { rows } = subRegions.data;
            const parsedResponse = [];
            uniqBy(rows).forEach(row => {
              parsedResponse.push({
                id: parseGadm36Id(row.id).adm2,
                name: row.name
              });
            });
            const blackList = blacklistResponse.data.rows.map(i => i.adm2);
            const subRegionList =
              parsedResponse &&
              parsedResponse.filter(r => blackList.indexOf(r.id) === -1);
            dispatch(setSubRegions(uniqBy(subRegionList, 'id')));
            dispatch(setSubRegionsLoading(false));
          })
        )
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
              bounds: getBoxBounds(bbox, country, region)
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
