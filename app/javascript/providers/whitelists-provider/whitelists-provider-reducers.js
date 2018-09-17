import * as actions from './whitelists-provider-actions';

export const initialState = {
  countriesLoading: false,
  regionsLoading: false,
  countries: [],
  regions: []
};

const setCountryWhitelistLoading = (state, { payload }) => ({
  ...state,
  countriesLoading: payload
});

const setRegionWhitelistLoading = (state, { payload }) => ({
  ...state,
  regionsLoading: payload
});

const setCountryWhitelist = (state, { payload }) => ({
  ...state,
  countriesLoading: false,
  countries: payload
});

const setRegionWhitelist = (state, { payload }) => ({
  ...state,
  regionsLoading: false,
  regions: payload
});

export default {
  [actions.setCountryWhitelistLoading]: setCountryWhitelistLoading,
  [actions.setRegionWhitelistLoading]: setRegionWhitelistLoading,
  [actions.setCountryWhitelist]: setCountryWhitelist,
  [actions.setRegionWhitelist]: setRegionWhitelist
};
