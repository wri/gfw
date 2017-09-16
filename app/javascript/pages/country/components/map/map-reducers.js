export const initialState = {
  zoom: 4,
  center: {
    latitude: 0,
    longitude: 20
  }
};

const setMapZoom = (state, { payload }) => ({
  ...state,
  zoom: payload
});

export default {
  setMapZoom
};
