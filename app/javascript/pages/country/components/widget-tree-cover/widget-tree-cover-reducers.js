export const initialState = {
  isLoading: true,
  totalCover: 0,
  totalIntactForest: 0,
  totalNonForest: 0
};

const setTreeCoverValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  totalCover: payload.totalCover,
  totalIntactForest: payload.totalIntactForest,
  totalNonForest: payload.totalNonForest
});

export default {
  setTreeCoverValues
};
