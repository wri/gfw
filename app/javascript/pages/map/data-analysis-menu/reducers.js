export const initialState = {
  analysis: {
    option: null
  }
};

const setAnalysisData = (state, { payload }) => ({
  ...state,
  analysis: {
    ...state.analysis,
    ...payload
  }
});

export default {
  setAnalysisData
};
