export const initialState = {
  isLoading: true,
  admin0: '',
  admin1: 0,
  admin2: 0,
  locationName: '',
  admin0List: [],
  admin1List: [],
  admin2List: [],
  gfwHeaderHeight: 59,
  showMapMobile: false,
  isMapFixed: true,
  mapTop: 0
};

const setInitialState = state => ({
  ...state,
  isLoading: true,
  admin0: '',
  admin1: 0,
  admin2: 0,
  admin0List: [],
  admin1List: [],
  admin2List: [],
  isMapFixed: true,
  mapTop: 0
});

const setLocation = (state, { payload }) => ({
  ...state,
  admin0: payload.admin0,
  admin1: payload.admin1,
  admin2: payload.admin2
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

const setLocationName = (state, { payload }) => ({
  ...state,
  locationName: payload
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
  setLocation,
  setAdmin0List,
  setAdmin1List,
  setAdmin2List,
  setLocationName,
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
