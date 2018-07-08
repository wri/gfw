export const initialState = {
  analysis: {
    option: null,
    polygon: null,
    geostore: null,
    data: null
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
