import { createAction } from 'redux-actions';

const setTreeLossValues = createAction('setTreeLossValues');
const setTreeLossSettingsLocation = createAction('setTreeLossSettingsLocation');
const setTreeLossSettingsUnit = createAction('setTreeLossSettingsUnit');
const setTreeLossSettingsCanopy = createAction('setTreeLossSettingsCanopy');
const setTreeLossIsLoading = createAction('setTreeLossIsLoading');
const setTreeLossSettingsStartYear = createAction('setTreeLossSettingsStartYear');
const setTreeLossSettingsEndYear = createAction('setTreeLossSettingsEndYear');
const setLayers = createAction('setLayers');

export default {
  setTreeLossValues,
  setTreeLossSettingsLocation,
  setTreeLossSettingsUnit,
  setTreeLossSettingsCanopy,
  setTreeLossIsLoading,
  setTreeLossSettingsStartYear,
  setTreeLossSettingsEndYear,
  setLayers
};
