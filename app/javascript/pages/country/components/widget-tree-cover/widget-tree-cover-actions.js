import { createAction } from 'redux-actions';

const setTreeCoverIsLoading = createAction('setTreeCoverIsLoading');
const setTreeCoverValues = createAction('setTreeCoverValues');
const setTreeCoverSettingsRegion = createAction('setTreeCoverSettingsRegion');
const setTreeCoverSettingsUnit = createAction('setTreeCoverSettingsUnit');
const setTreeCoverSettingsCanopy = createAction('setTreeCoverSettingsCanopy');
const setLayer = createAction('setLayer');

export default {
  setTreeCoverIsLoading,
  setTreeCoverValues,
  setTreeCoverSettingsRegion,
  setTreeCoverSettingsUnit,
  setTreeCoverSettingsCanopy,
  setLayer
};
