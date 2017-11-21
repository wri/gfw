export const initialState = {
  isLoading: true,
  iso: '',
  countryRegion: 0,
  countryData: {},
  countryRegions: [],
  countriesList: [],
  gfwHeaderHeight: 59,
  showMapMobile: false,
  isMapFixed: true,
  mapTop: 0
};

const setInitialState = state => ({
  ...state,
  isLoading: true,
  iso: '',
  countryRegion: 0,
  countryData: {},
  countryRegions: [],
  isMapFixed: true,
  mapTop: 0
});

const setIso = (state, { payload }) => ({
  ...state,
  iso: payload
});

const setRegion = (state, { payload }) => ({
  ...state,
  countryRegion: payload
});

const setCountryData = (state, { payload }) => ({
  ...state,
  countryData: payload.data,
  countryRegions: payload.regions,
  isLoading: false
});

const setCountriesList = (state, { payload }) => ({
  ...state,
  countriesList: payload
});

const setFixedMapStatus = (state, { payload }) => ({
  ...state,
  isMapFixed: payload
});

const setMapTop = (state, { payload }) => ({
  ...state,
  mapTop: payload
});

const setShowMapMobile = (state, { payload }) => ({
  ...state,
  showMapMobile: payload
});

export default {
  setInitialState,
  setIso,
  setRegion,
  setCountryData,
  setCountriesList,
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
