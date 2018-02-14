export const initialState = {
  countryWhitelistLoading: false,
  regionWhitelistLoading: false,
  waterBodiesWhitelistLoading: false,
  countryWhitelist: {},
  regionWhitelist: {},
  waterBodiesWhitelist: {}
};

const setCountryWhitelistLoading = (state, { payload }) => ({
  ...state,
  countryWhitelistLoading: payload
});

const setRegionWhitelistLoading = (state, { payload }) => ({
  ...state,
  regionWhitelistLoading: payload
});

const setWaterBodiesWhitelistLoading = (state, { payload }) => ({
  ...state,
  waterBodiesWhitelistLoading: payload
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

const setWaterBodiesWhitelist = (state, { payload }) => ({
  ...state,
  waterBodiesWhitelistLoading: false,
  waterBodiesWhitelist: payload
});

export default {
  setCountryWhitelistLoading,
  setRegionWhitelistLoading,
  setWaterBodiesWhitelistLoading,
  setCountryWhitelist,
  setRegionWhitelist,
  setWaterBodiesWhitelist
};
