import { createAction } from 'redux-actions';

const setTreeLossValues = createAction('setTreeLossValues');
const setLayer = createAction('setLayer');
const setTreeLossSettingsCanopy = createAction('setTreeLossSettingsCanopy');
const setTreeLossSettingsUnit = createAction('setTreeLossSettingsUnit');
const setTreeLossIsUpdating = createAction('setTreeLossIsUpdating');

export default {
  setTreeLossValues,
  setLayer,
  setTreeLossSettingsCanopy,
  setTreeLossSettingsUnit,
  setTreeLossIsUpdating,
};
