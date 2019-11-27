import * as actions from './actions';

export const initialState = {
  checkingShape: false,
  uploadingShape: false,
  loading: false,
  error: '',
  errorMessage: '',
  data: {},
  location: {},
  settings: {
    showDraw: false
  }
};

const setAnalysisData = (state, { payload }) => ({
  ...state,
  data: payload.responses,
  location: payload.location,
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

const clearAnalysisData = state => ({
  ...state,
  data: {},
  location: {}
});

export default {
  [actions.setAnalysisData]: setAnalysisData,
  [actions.setAnalysisLoading]: setAnalysisLoading,
  [actions.clearAnalysisError]: clearAnalysisError,
  [actions.clearAnalysisData]: clearAnalysisData
};
