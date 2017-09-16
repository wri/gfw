export const initialState = {
  isLoading: true,
  iso: '',
  countryRegion: 0,
  countryData: {},
  countryRegions: [],
  countriesList: [],
};

const setInitialState = (state) => ({
  ...state,
  isLoading: true,
  iso: '',
  countryRegion: 0,
  countryData: {},
  countryRegions: []
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

export default {
  setInitialState,
  setIsLoading,
  setIso,
  setRegion,
  setCountryData,
  setCountryRegions,
  setCountriesList
};
