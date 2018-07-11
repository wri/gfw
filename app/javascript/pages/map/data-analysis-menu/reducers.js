export const initialState = {
  analysis: {
    loading: false,
    option: 'layer',
    location: null,
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
