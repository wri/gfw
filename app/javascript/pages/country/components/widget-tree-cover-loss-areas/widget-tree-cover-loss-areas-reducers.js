export const initialState = {
  isLoading: true,
};

const setTreeCoverLossAreasValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
});

export default {
  setTreeCoverLossAreasValues
};
