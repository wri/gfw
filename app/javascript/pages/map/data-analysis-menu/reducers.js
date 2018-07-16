export const initialState = {
  analysis: {
    loading: false,
    showResults: false,
    option: 'layer',
    location: {
      country: undefined,
      region: undefined,
      subRegion: undefined
    },
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
