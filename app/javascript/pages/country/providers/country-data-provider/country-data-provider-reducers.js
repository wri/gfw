export const initialState = {
  isCountriesLoading: false,
  isRegionsLoading: false,
  isSubRegionsLoading: false,
  isGeostoreLoading: false,
  isWhitelistLoading: false,
  countries: [],
  gadmCountries: [],
  faoCountries: [],
  regions: [],
  subRegions: [],
  countryWhitelist: {},
  regionWhitelist: {},
  countryLinks: {},
  geostore: {
    areaHa: 0,
    bounds: []
  }
};

const mapLocations = locations => {
  const locationsMapped = [];
  locations.forEach(location => {
    if (location.iso || location.id > 0) {
      locationsMapped.push({
        label: location.name,
        value: location.iso || location.id
      });
    }
  });
  return locationsMapped;
};

const setCountriesLoading = (state, { payload }) => ({
  ...state,
  isCountriesLoading: payload
});

const setRegionsLoading = (state, { payload }) => ({
  ...state,
  isRegionsLoading: payload
});

const setSubRegionsLoading = (state, { payload }) => ({
  ...state,
  isSubRegionsLoading: payload
});

const setGeostoreLoading = (state, { payload }) => ({
  ...state,
  isGeostoreLoading: payload
});

const setCountryWhitelistLoading = (state, { payload }) => ({
  ...state,
  isCountryWhitelistLoading: payload
});

const setRegionWhitelistLoading = (state, { payload }) => ({
  ...state,
  isRegionWhitelistLoading: payload
});

const setCountries = (state, { payload }) => ({
  ...state,
  countries: mapLocations(payload)
});

const setGadmCountries = (state, { payload }) => ({
  ...state,
  gadmCountries: mapLocations(payload)
});

const setFAOCountries = (state, { payload }) => ({
  ...state,
  faoCountries: mapLocations(payload)
});

const setRegions = (state, { payload }) => ({
  ...state,
  regions: mapLocations(payload)
});

const setSubRegions = (state, { payload }) => ({
  ...state,
  subRegions: mapLocations(payload)
});

const setCountryWhitelist = (state, { payload }) => ({
  ...state,
  isCountryWhitelistLoading: false,
  countryWhitelist: payload
});

const setRegionWhitelist = (state, { payload }) => ({
  ...state,
  isRegionWhitelistLoading: false,
  regionWhitelist: payload
});

const setCountryLinks = (state, { payload }) => ({
  ...state,
  isCountryLinksLoading: false,
  countryLinks: payload
});

const setGeostore = (state, { payload }) => ({
  ...state,
  geostore: {
    ...payload
  }
});

export default {
  setCountriesLoading,
  setRegionsLoading,
  setSubRegionsLoading,
  setGeostoreLoading,
  setCountryWhitelistLoading,
  setRegionWhitelistLoading,
  setCountries,
  setFAOCountries,
  setGadmCountries,
  setRegions,
  setSubRegions,
  setGeostore,
  setCountryWhitelist,
  setRegionWhitelist,
  setCountryLinks
};
