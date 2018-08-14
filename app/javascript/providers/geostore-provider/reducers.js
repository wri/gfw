export const initialState = {
  loading: false,
  geostore: {
    hash: '',
    areaHa: 0,
    bbox: []
  }
};

const setGeostore = (state, { payload }) => ({
  ...state,
  geostore: {
    ...payload
  }
});

const setGeostoreLoading = (state, { payload }) => ({
  ...state,
  loading: payload
});

export default {
  setGeostore,
  setGeostoreLoading
};
