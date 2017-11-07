import { createAction } from 'redux-actions';

const setTreeCoverIsUpdating = createAction('setTreeCoverIsUpdating');
const setTreeCoverValues = createAction('setTreeCoverValues');
const setTreeCoverSettingsLocation = createAction('setTreeCoverSettingsLocation');
const setTreeCoverSettingsCanopy = createAction('setTreeCoverSettingsCanopy');
const setLayer = createAction('setLayer');

export default {
  setTreeCoverIsUpdating,
  setTreeCoverValues,
  setTreeCoverSettingsLocation,
  setTreeCoverSettingsCanopy,
  setLayer
};
