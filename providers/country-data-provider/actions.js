import { createAction, createThunkAction } from 'redux/actions';
import { parseGadm36Id } from 'utils/gadm';
import uniqBy from 'lodash/uniqBy';

import {
  getRegionsProvider,
  getSubRegionsProvider,
  getCountryLinksProvider,
  getCategorisedCountries,
} from 'services/country';

export const setCountriesSSR = createAction('setCountriesSSR');

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
  () => (dispatch) => {
    dispatch(setCountriesLoading(true));
    getCategorisedCountries()
      .then(({ gadmCountries, faoCountries, countries }) => {
        dispatch(setGadmCountries(gadmCountries));
        dispatch(setFAOCountries(faoCountries));
        dispatch(setCountries(countries));
        dispatch(setCountriesLoading(false));
      })
      .catch(() => {
        dispatch(setCountriesLoading(false));
      });
  }
);

export const getRegions = createThunkAction(
  'getRegions',
  (country) => (dispatch) => {
    dispatch(setRegionsLoading(true));
    getRegionsProvider(country)
      .then((response) => {
        const parsedResponse = [];
        uniqBy(response.data.rows).forEach((row) => {
          parsedResponse.push({
            id: parseGadm36Id(row.id).adm1,
            name: row.name,
          });
        });
        dispatch(setRegions(parsedResponse, 'id'));
        dispatch(setRegionsLoading(false));
      })
      .catch(() => {
        dispatch(setRegionsLoading(false));
      });
  }
);

export const getSubRegions = createThunkAction(
  'getSubRegions',
  ({ adm0, adm1, token }) =>
    (dispatch) => {
      dispatch(setSubRegionsLoading(true));
      getSubRegionsProvider(adm0, adm1, token)
        .then((subRegions) => {
          const { rows } = subRegions.data;
          const parsedResponse = [];
          uniqBy(rows).forEach((row) => {
            parsedResponse.push({
              id: parseGadm36Id(row.id).adm2,
              name: row.name,
            });
          });
          dispatch(setSubRegions(uniqBy(parsedResponse, 'id')));
          dispatch(setSubRegionsLoading(false));
        })
        .catch(() => {
          dispatch(setSubRegionsLoading(false));
        });
    }
);

export const getCountryLinks = createThunkAction(
  'getCountryLinks',
  () => (dispatch) => {
    dispatch(setCountryLinksLoading(true));
    getCountryLinksProvider()
      .then((response) => {
        const data = {};

        if (response?.rows?.length) {
          response.rows.forEach((d) => {
            data[d.iso] = JSON.parse(d.external_links);
          });
        }
        dispatch(setCountryLinks(data));
      })
      .catch(() => {
        dispatch(setCountryLinksLoading(false));
      });
  }
);
