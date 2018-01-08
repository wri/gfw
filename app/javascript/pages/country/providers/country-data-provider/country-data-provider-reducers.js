export const initialState = {
  isCountriesLoading: false,
  isRegionsLoading: false,
  isSubRegionsLoading: false,
  isGeostoreLoading: false,
  countries: [],
  regions: [],
  subRegions: [],
  whitelists: [],
  geostore: {
    areaHa: 0,
    bounds: []
  }
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

const setCountries = (state, { payload }) => ({
  ...state,
  countries: payload.map(d => ({ label: d.name, value: d.iso }))
});

const setRegions = (state, { payload }) => ({
  ...state,
  regions: payload.map(d => ({ label: d.name, value: d.id }))
});

const setSubRegions = (state, { payload }) => ({
  ...state,
  subRegions: payload.map(d => ({ label: d.name, value: d.id }))
});

const setWhitelists = (state, { payload }) => ({
  ...state,
  whitelists: payload
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
  setCountries,
  setRegions,
  setSubRegions,
  setGeostore,
  setWhitelists
};
