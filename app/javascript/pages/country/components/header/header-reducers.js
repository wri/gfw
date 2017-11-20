export const initialState = {
  totalCoverHeader: 0,
  totalForestHeader: 0,
  percentageForestHeader: 0,
  totalCoverLoss: 0
};

const setTreeCoverValuesHeader = (state, { payload }) => ({
  ...state,
  totalCoverHeader: payload.totalCoverHeader,
  totalForestHeader: payload.totalForestHeader,
  percentageForestHeader: payload.percentageForestHeader,
  totalCoverLoss: payload.totalCoverLoss
});

export default {
  setTreeCoverValuesHeader
};
