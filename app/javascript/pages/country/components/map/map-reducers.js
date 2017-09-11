export const initialState = {
  zoom: 1,
  center: {
    latitude: 0,
    longitude: 20
  }
};

const setMapZoom = (zoom, state) => ({
  ...state,
  zoom
});

export default {
  setMapZoom: (state, { payload }) => setMapZoom(payload, state)
};
