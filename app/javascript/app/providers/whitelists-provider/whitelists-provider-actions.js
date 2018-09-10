import { createAction, createThunkAction } from 'redux-tools';

import {
  getCountryWhitelistProvider,
  getRegionWhitelistProvider
} from 'services/whitelists';

export const setCountryWhitelistLoading = createAction(
  'setCountryWhitelistLoading'
);
export const setRegionWhitelistLoading = createAction(
  'setRegionWhitelistLoading'
);

export const setCountryWhitelist = createAction('setCountryWhitelist');
export const setRegionWhitelist = createAction('setRegionWhitelist');

export const getCountryWhitelist = createThunkAction(
  'getCountryWhitelist',
  country => (dispatch, state) => {
    if (!state().whitelists.countryWhitelistLoading) {
      dispatch(setCountryWhitelistLoading(true));
      getCountryWhitelistProvider(country)
        .then(response => {
          const data =
            response.data.data && response.data.data.map(d => d.polyname);
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
    if (!state().whitelists.regionWhitelistLoading) {
      dispatch(setRegionWhitelistLoading(true));
      getRegionWhitelistProvider(country, region, subRegion)
        .then(response => {
          const data =
            response.data.data && response.data.data.map(d => d.polyname);
          dispatch(setRegionWhitelist(data));
        })
        .catch(error => {
          dispatch(setRegionWhitelistLoading(false));
          console.info(error);
        });
    }
  }
);
