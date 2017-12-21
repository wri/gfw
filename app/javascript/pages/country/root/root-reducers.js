export const initialState = {
  gfwHeaderHeight: 58,
  showMapMobile: false,
  category: 'summary'
};

const setFixedMapStatus = (state, { payload }) => ({
  ...state,
  isMapFixed: payload
});

const setShowMapMobile = (state, { payload }) => ({
  ...state,
  showMapMobile: payload
});

const setCategory = (state, { payload }) => ({
  ...state,
  category: payload
});

export default {
  setFixedMapStatus,
  setShowMapMobile,
  setCategory
};
