import { createAction } from 'redux-actions';

const setTreeCoverIsLoading = createAction('setTreeCoverIsLoading');
const setTreeCoverValues = createAction('setTreeCoverValues');
const setTreeCoverSettingsLocation = createAction(
  'setTreeCoverSettingsLocation'
);
const setTreeCoverSettingsUnit = createAction('setTreeCoverSettingsUnit');
const setTreeCoverSettingsCanopy = createAction('setTreeCoverSettingsCanopy');
const setLayers = createAction('setLayers');

export default {
  setTreeCoverIsLoading,
  setTreeCoverValues,
  setTreeCoverSettingsLocation,
  setTreeCoverSettingsUnit,
  setTreeCoverSettingsCanopy,
  setLayers
};
