export const initialState = {
  totalCoverHeader: 'Nan',
  totalForestHeader: 'Nan',
  percentageForestHeader: 'Nan',
};

const setTreeCoverValuesHeader = (state, { payload }) => ({
  ...state,
  totalCoverHeader: payload.totalCoverHeader,
  totalForestHeader: payload.totalForestHeader,
  percentageForestHeader: payload.percentageForestHeader,
});

export default {
  setTreeCoverValuesHeader
};
