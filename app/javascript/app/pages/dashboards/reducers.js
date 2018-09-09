export const initialState = {
  showMapMobile: false
};

const setShowMapMobile = (state, { payload }) => ({
  ...state,
  showMapMobile: payload
});

export default {
  setShowMapMobile
};
