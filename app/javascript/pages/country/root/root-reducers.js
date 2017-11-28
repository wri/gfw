export const initialState = {
  isLoading: false,
  gfwHeaderHeight: 59,
  showMapMobile: false,
  isMapFixed: true,
  mapTop: 0,
  countries: [],
  regions: [],
  subRegions: [],
  geostore: {
    areaHa: 0,
    bounds: []
  }
};

const setIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setCountries = (state, { payload }) => ({
  ...state,
  countries: payload.map(d => ({ label: d.name, value: d.iso }))
});

const setRegions = (state, { payload }) => ({
  ...state,
  regions: payload.map(d => ({ label: d.name, value: d.id.toString() }))
});

const setSubRegions = (state, { payload }) => ({
  ...state,
  subRegions: payload.map(d => ({ label: d.name, value: d.id.toString() }))
});

const setGeostore = (state, { payload }) => ({
  ...state,
  geostore: payload
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
  setIsLoading,
  setCountries,
  setRegions,
  setSubRegions,
  setGeostore,
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
