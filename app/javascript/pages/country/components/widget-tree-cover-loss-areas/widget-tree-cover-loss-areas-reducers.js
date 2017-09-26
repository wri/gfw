export const initialState = {
  isLoading: true,
  regionData: []
};

const setPieCharDataDistricts = (state, { payload }) => ({
  ...state,
  isLoading: false,
  regionData: payload
});

export default {
  setPieCharDataDistricts
};
