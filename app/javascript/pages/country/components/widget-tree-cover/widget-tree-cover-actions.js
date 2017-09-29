import { createAction } from 'redux-actions';

const setTreeCoverValues = createAction('setTreeCoverValues');
const setTreeCoverSettingsRegion = createAction('setTreeCoverSettingsRegion');
const setTreeCoverSettingsUnit = createAction('setTreeCoverSettingsUnit');
const setTreeCoverSettingsCanopy = createAction('setTreeCoverSettingsCanopy');
const setLayer = createAction('setLayer');

export default {
  setTreeCoverValues,
  setTreeCoverSettingsRegion,
  setTreeCoverSettingsUnit,
  setTreeCoverSettingsCanopy,
  setLayer
};
