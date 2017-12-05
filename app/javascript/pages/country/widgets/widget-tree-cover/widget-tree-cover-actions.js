import { createAction } from 'redux-actions';

const setTreeCoverIsLoading = createAction('setTreeCoverIsLoading');
const setTreeCoverValues = createAction('setTreeCoverValues');
const setTreeCoverSettingsIndicator = createAction(
  'setTreeCoverSettingsIndicator'
);
const setTreeCoverSettingsUnit = createAction('setTreeCoverSettingsUnit');
const setTreeCoverSettingsCanopy = createAction('setTreeCoverSettingsCanopy');
const setLayers = createAction('setLayers');

export default {
  setTreeCoverIsLoading,
  setTreeCoverValues,
  setTreeCoverSettingsIndicator,
  setTreeCoverSettingsUnit,
  setTreeCoverSettingsCanopy,
  setLayers
};
