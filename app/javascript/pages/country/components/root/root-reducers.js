export const initialState = {
  isLoading: true,
  iso: '',
  countryRegion: 0,
  countryData: {},
  countryRegions: [],
  countriesList: [],
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

const setIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
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
  countryData: payload
});

const setCountryRegions = (state, { payload }) => ({
  ...state,
  countryRegions: payload
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

export default {
  setInitialState,
  setIsLoading,
  setIso,
  setRegion,
  setCountryData,
  setCountryRegions,
  setCountriesList,
  setPositionMap,
  setTopMap,
  setPositionPage
};
