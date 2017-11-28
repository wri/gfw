export const initialState = {
  isLoading: true,
  locationNames: {
    admin0: '',
    admin1: '',
    admin2: '',
    current: ''
  },
  admin0List: [],
  admin1List: [],
  admin2List: [],
  geostore: {
    areaHa: 0,
    bounds: []
  },
  gfwHeaderHeight: 59,
  showMapMobile: false,
  isMapFixed: true,
  mapTop: 0
};

const setInitialState = state => ({
  ...state,
  isLoading: true,
  admin0List: [],
  admin1List: [],
  admin2List: [],
  isMapFixed: true,
  mapTop: 0
});

const setIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setAdmin0List = (state, { payload }) => ({
  ...state,
  admin0List: payload
});

const setAdmin1List = (state, { payload }) => ({
  ...state,
  admin1List: payload
});

const setAdmin2List = (state, { payload }) => ({
  ...state,
  admin2List: payload
});

const setLocationNames = (state, { payload }) => ({
  ...state,
  locationNames: payload
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
  setInitialState,
  setIsLoading,
  setAdmin0List,
  setAdmin1List,
  setAdmin2List,
  setLocationNames,
  setGeostore,
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
