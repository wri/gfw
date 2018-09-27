import * as actions from './actions';

export const initialState = {
  loading: false,
  error: '',
  errorMessage: '',
  data: {},
  settings: {
    showAnalysis: false,
    showDraw: false
  }
};

const setAnalysisData = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false
});

const setAnalysisLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const clearAnalysisError = state => ({
  ...state,
  error: '',
  errorMessage: ''
});

export default {
  [actions.setAnalysisData]: setAnalysisData,
  [actions.setAnalysisLoading]: setAnalysisLoading,
  [actions.clearAnalysisError]: clearAnalysisError
};
