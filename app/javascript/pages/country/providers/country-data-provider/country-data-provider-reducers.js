export const initialState = {
  isCountriesLoading: false,
  isRegionsLoading: false,
  isSubRegionsLoading: false,
  isGeostoreLoading: false,
  isWhitelistLoading: false,
  countries: [],
  regions: [],
  subRegions: [],
  whitelist: [],
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

const setWhitelistLoading = (state, { payload }) => ({
  ...state,
  isWhitelistLoading: payload
});

const setCountries = (state, { payload }) => ({
  ...state,
  countries: mapLocations(payload)
});

const setRegions = (state, { payload }) => ({
  ...state,
  regions: mapLocations(payload)
});

const setSubRegions = (state, { payload }) => ({
  ...state,
  subRegions: mapLocations(payload)
});

const setWhitelist = (state, { payload }) => ({
  ...state,
  isWhitelistLoading: false,
  whitelist: payload.map(d => d.polyname)
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
  setWhitelistLoading,
  setCountries,
  setRegions,
  setSubRegions,
  setGeostore,
  setWhitelist
};
