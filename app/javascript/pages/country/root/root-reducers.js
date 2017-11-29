export const initialState = {
  gfwHeaderHeight: 59,
  showMapMobile: false,
  isMapFixed: true,
  mapTop: 0
};

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
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
