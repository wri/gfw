import { createAction } from 'redux-actions';

const setTreeLossValues = createAction('setTreeLossValues');
const setTreeLossSettingsIndicator = createAction(
  'setTreeLossSettingsIndicator'
);
const setTreeLossSettingsCanopy = createAction('setTreeLossSettingsCanopy');
const setTreeLossIsLoading = createAction('setTreeLossIsLoading');
const setTreeLossSettingsStartYear = createAction(
  'setTreeLossSettingsStartYear'
);
const setTreeLossSettingsEndYear = createAction('setTreeLossSettingsEndYear');
const setLayers = createAction('setLayers');

export default {
  setTreeLossValues,
  setTreeLossSettingsIndicator,
  setTreeLossSettingsCanopy,
  setTreeLossIsLoading,
  setTreeLossSettingsStartYear,
  setTreeLossSettingsEndYear,
  setLayers
};
