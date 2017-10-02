export const initialState = {
  isLoading: true,
  topRegions: [],
  startArray: 0,
  endArray: 10
};

const setTreeLocatedValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  topRegions: payload
});

const setArrayLocated = (state, { payload }) => ({
  ...state,
  startArray: payload.startArray,
  endArray: payload.endArray
});

export default {
  setTreeLocatedValues,
  setArrayLocated
};
