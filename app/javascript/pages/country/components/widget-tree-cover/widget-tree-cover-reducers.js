export const initialState = {
  isLoading: true,
  totalCover: 0,
  totalIntactForest: 0,
  totalNonForest: 0
};

const setIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setValues = (state, { payload }) => ({
  ...state,
  totalCover: payload.totalCover,
  totalIntactForest: payload.totalIntactForest,
  totalNonForest: payload.totalNonForest
});

export default {
  setIsLoading,
  setValues
};
