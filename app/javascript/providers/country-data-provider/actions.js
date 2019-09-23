import { createAction, createThunkAction } from 'redux-tools';
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

export const setCountriesLoading = createAction('setCountriesLoading');
export const setRegionsLoading = createAction('setRegionsLoading');
export const setSubRegionsLoading = createAction('setSubRegionsLoading');
export const setCountryLinksLoading = createAction('setCountryLinksLoading');

export const setCountries = createAction('setCountries');
export const setFAOCountries = createAction('setFAOCountries');
export const setGadmCountries = createAction('setGadmCountries');
export const setRegions = createAction('setRegions');
export const setSubRegions = createAction('setSubRegions');
export const setCountryLinks = createAction('setCountryLinks');

export const getCountries = createThunkAction(
  'getCountries',
  () => dispatch => {
    dispatch(setCountriesLoading(true));
    axios
      .all([getCountriesProvider(), getFAOCountriesProvider()])
      .then(
        axios.spread((gadm36Countries, faoCountries) => {
          dispatch(setGadmCountries(gadm36Countries.data.rows));
          dispatch(setFAOCountries(faoCountries.data.rows));
          dispatch(setCountries(gadm36Countries.data.rows));
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
  country => dispatch => {
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
);

export const getSubRegions = createThunkAction(
  'getSubRegions',
  ({ adm0, adm1, token }) => dispatch => {
    dispatch(setSubRegionsLoading(true));
    getSubRegionsProvider(adm0, adm1, token)
      .then(subRegions => {
        const { rows } = subRegions.data;
        const parsedResponse = [];
        uniqBy(rows).forEach(row => {
          parsedResponse.push({
            id: parseGadm36Id(row.id).adm2,
            name: row.name
          });
        });
        dispatch(setSubRegions(uniqBy(parsedResponse, 'id')));
        dispatch(setSubRegionsLoading(false));
      })
      .catch(error => {
        dispatch(setSubRegionsLoading(false));
        console.info(error);
      });
  }
);

export const getCountryLinks = createThunkAction(
  'getCountryLinks',
  () => dispatch => {
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
);
