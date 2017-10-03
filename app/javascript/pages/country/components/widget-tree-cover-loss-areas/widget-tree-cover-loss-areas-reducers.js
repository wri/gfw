export const initialState = {
  isLoading: true,
  regionData: [],
  startArray: 0,
  endArray: 10
};

const setPieCharDataDistricts = (state, { payload }) => ({
  ...state,
  isLoading: false,
  regionData: payload
});

const setArrayCoverAreasLoss = (state, { payload }) => ({
  ...state,
  startArray: payload.startArray,
  endArray: payload.endArray
});

export default {
  setPieCharDataDistricts,
  setArrayCoverAreasLoss
};
