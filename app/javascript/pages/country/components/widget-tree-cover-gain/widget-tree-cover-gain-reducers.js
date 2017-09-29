export const initialState = {
  isLoading: true,
  totalAmount: 0,
  percentage: 0
};

const setTreeCoverGainValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  totalAmount: payload.totalAmount,
  percentage: payload.percentage,
});

export default {
  setTreeCoverGainValues
};
