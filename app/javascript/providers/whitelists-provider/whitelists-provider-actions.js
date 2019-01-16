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
  adm0 => (dispatch, getState) => {
    const { whitelists } = getState();
    if (whitelists && !whitelists.countriesLoading) {
      dispatch(setCountryWhitelistLoading(true));
      getCountryWhitelistProvider(adm0)
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
  ({ adm0, adm1, adm2 }) => (dispatch, getState) => {
    const { whitelists } = getState();
    if (whitelists && !whitelists.regionsLoading) {
      dispatch(setRegionWhitelistLoading(true));
      getRegionWhitelistProvider(adm0, adm1, adm2)
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
