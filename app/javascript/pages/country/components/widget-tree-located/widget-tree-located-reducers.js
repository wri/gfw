export const initialState = {
  isLoading: true,
  topRegions: []
};

const setTreeLocatedValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  topRegions: payload
});

export default {
  setTreeLocatedValues
};
