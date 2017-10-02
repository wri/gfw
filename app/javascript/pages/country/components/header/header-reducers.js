export const initialState = {
  totalCoverHeader: 'Nan',
  totalForestHeader: 'Nan',
  percentageForestHeader: 'Nan',
  totalCoverLoss: 'Nan'
};

const setTreeCoverValuesHeader = (state, { payload }) => ({
  ...state,
  totalCoverHeader: payload.totalCoverHeader,
  totalForestHeader: payload.totalForestHeader,
  percentageForestHeader: payload.percentageForestHeader,
  totalCoverLoss: payload.totalCoverLoss,
});

export default {
  setTreeCoverValuesHeader
};
