import * as actions from './actions';

export const initialState = {
  hidePanels: false,
  hideLegend: false,
  showBasemaps: false,
  showRecentImagery: false,
  showAnalysis: false
};

const setMainMapSettings = (state, { payload }) => ({
  ...state,
  ...payload
});

export default {
  [actions.setMainMapSettings]: setMainMapSettings
};
