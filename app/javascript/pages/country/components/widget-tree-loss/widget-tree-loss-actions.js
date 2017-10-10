import { createAction } from 'redux-actions';

const setTreeLossValues = createAction('setTreeLossValues');
const setLayer = createAction('setLayer');
const setTreeLossSettingsCanopy = createAction('setTreeLossSettingsCanopy');
const setTreeLossSettingsUnit = createAction('setTreeLossSettingsUnit');
const setTreeLossIsUpdating = createAction('setTreeLossIsUpdating');
const setTreeLossSettingsStartYear = createAction('setTreeLossSettingsStartYear');
const setTreeLossSettingsEndYear = createAction('setTreeLossSettingsEndYear');

export default {
  setTreeLossValues,
  setLayer,
  setTreeLossSettingsCanopy,
  setTreeLossSettingsUnit,
  setTreeLossIsUpdating,
  setTreeLossSettingsStartYear,
  setTreeLossSettingsEndYear
};
