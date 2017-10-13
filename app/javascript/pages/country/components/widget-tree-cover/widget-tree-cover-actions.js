import { createAction } from 'redux-actions';

const setTreeCoverIsUpdating = createAction('setTreeCoverIsUpdating');
const setTreeCoverValues = createAction('setTreeCoverValues');
const setTreeCoverSettingsRegion = createAction('setTreeCoverSettingsRegion');
const setTreeCoverSettingsCanopy = createAction('setTreeCoverSettingsCanopy');
const setLayer = createAction('setLayer');

export default {
  setTreeCoverIsUpdating,
  setTreeCoverValues,
  setTreeCoverSettingsRegion,
  setTreeCoverSettingsCanopy,
  setLayer
};
