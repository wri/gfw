export const initialState = {
  isLoading: true,
  areaData: [],
  areaChartData: [],
  startArray: 0,
  endArray: 10
};

const setPieCharDataAreas = (state, { payload }) => ({
  ...state,
  isLoading: false,
  areaData: payload
});

const setPieCharDataAreasTotal = (state, { payload }) => ({
  ...state,
  areaChartData: payload
});

const setArrayCoverAreasGain = (state, { payload }) => ({
  ...state,
  startArray: payload.startArray,
  endArray: payload.endArray
});

export default {
  setPieCharDataAreas,
  setArrayCoverAreasGain,
  setPieCharDataAreasTotal
};
