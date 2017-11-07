export const initialState = {
  isLoading: true,
  iso: '',
  countryRegion: 0,
  countryData: {},
  countryRegions: [],
  countriesList: [],
  showMapMobile: false,
  fixed: false,
  topMap: 0,
  topPage: false
};

const setInitialState = (state) => ({
  ...state,
  isLoading: true,
  iso: '',
  countryRegion: 0,
  countryData: {},
  countryRegions: [],
  fixed: false,
  topPage: false
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

const setPositionMap = (state, {payload}) => ({
  ...state,
  fixed: payload
});

const setPositionPage = (state, {payload}) => ({
  ...state,
  topPage: payload
});

const setTopMap = (state, {payload}) => ({
  ...state,
  topMap: payload
});

const setShowMapMobile = (state, {payload}) => ({
  ...state,
  showMapMobile: payload
});

export default {
  setInitialState,
  setIso,
  setRegion,
  setCountryData,
  setCountriesList,
  setPositionMap,
  setTopMap,
  setPositionPage,
  setShowMapMobile
};
