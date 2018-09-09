export const initialState = {
  loading: false,
  geostore: {}
};

const setGeostore = (state, { payload }) => ({
  ...state,
  geostore: {
    ...payload
  }
});

const setGeostoreLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  setGeostore,
  setGeostoreLoading
};
