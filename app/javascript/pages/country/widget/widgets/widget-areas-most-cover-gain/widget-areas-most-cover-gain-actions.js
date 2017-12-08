import { createAction } from 'redux-actions';

const setAreasMostCoverIsLoading = createAction('setAreasMostCoverIsLoading');
const setAreasMostCoverGainValues = createAction('setAreasMostCoverGainValues');
const setAreasMostCoverGainSettingsLocation = createAction(
  'setAreasMostCoverGainSettingsLocation'
);
const setAreasMostCoverGainSettingsUnit = createAction(
  'setAreasMostCoverGainSettingsUnit'
);
const setAreasMostCoverGainPage = createAction('setAreasMostCoverGainPage');

export default {
  setAreasMostCoverIsLoading,
  setAreasMostCoverGainValues,
  setAreasMostCoverGainSettingsLocation,
  setAreasMostCoverGainSettingsUnit,
  setAreasMostCoverGainPage
};
