import { createAction } from 'redux-actions';

const setTreeCoverGainIsLoading = createAction('setTreeCoverGainIsLoading');
const setTreeCoverGainValues = createAction('setTreeCoverGainValues');
const setTreeCoverGainSettingsLocation = createAction(
  'setTreeCoverGainSettingsLocation'
);

export default {
  setTreeCoverGainIsLoading,
  setTreeCoverGainValues,
  setTreeCoverGainSettingsLocation
};
