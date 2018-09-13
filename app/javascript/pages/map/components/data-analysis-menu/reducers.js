import * as actions from './actions';

export const initialState = {
  loading: false,
  data: {},
  settings: {
    showAnalysis: false,
    showDraw: false
  }
};

const setAnalysisData = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  }
});

export default {
  [actions.setAnalysisData]: setAnalysisData
};
