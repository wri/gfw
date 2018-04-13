export const initialState = {
  gfwHeaderHeight: 58,
  showMapMobile: false
};

const setFixedMapStatus = (state, { payload }) => ({
  ...state,
  isMapFixed: payload
});

const setShowMapMobile = (state, { payload }) => ({
  ...state,
  showMapMobile: payload
});

export default {
  setFixedMapStatus,
  setShowMapMobile
};
