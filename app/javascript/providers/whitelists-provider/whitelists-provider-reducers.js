import * as actions from './whitelists-provider-actions';

export const initialState = {
  countryWhitelistLoading: false,
  regionWhitelistLoading: false,
  countryWhitelist: [],
  regionWhitelist: []
};

const setCountryWhitelistLoading = (state, { payload }) => ({
  ...state,
  countryWhitelistLoading: payload
});

const setRegionWhitelistLoading = (state, { payload }) => ({
  ...state,
  regionWhitelistLoading: payload
});

const setCountryWhitelist = (state, { payload }) => ({
  ...state,
  countryWhitelistLoading: false,
  countryWhitelist: payload
});

const setRegionWhitelist = (state, { payload }) => ({
  ...state,
  regionWhitelistLoading: false,
  regionWhitelist: payload
});

export default {
  [actions.setCountryWhitelistLoading]: setCountryWhitelistLoading,
  [actions.setRegionWhitelistLoading]: setRegionWhitelistLoading,
  [actions.setCountryWhitelist]: setCountryWhitelist,
  [actions.setRegionWhitelist]: setRegionWhitelist
};
