import { createAction } from 'redux-actions';

const setPieCharDataDistricts = createAction('setPieCharDataDistricts');
const setArrayCoverAreasLoss = createAction('setArrayCoverAreasLoss');
const setPieChartDataTotal = createAction('setPieChartDataTotal');

const setTreeCoverLossAreasSettingsUnit = createAction('setTreeCoverLossAreasSettingsUnit');
const setTreeCoverLossAreasSettingsCanopy = createAction('setTreeCoverLossAreasSettingsCanopyl');
const setTreeCoverLossAreasSettingsStartYear = createAction('setTreeCoverLossAreasSettingsStartYear');
const setTreeCoverLossAreasSettingsEndYear = createAction('setTreeCoverLossAreasSettingsEndYear');
const setTreeCoverLossAreasdIsUpdating = createAction('setTreeCoverLossAreasdIsUpdating');

export default {
  setPieCharDataDistricts,
  setArrayCoverAreasLoss,
  setPieChartDataTotal,
  setTreeCoverLossAreasSettingsUnit,
  setTreeCoverLossAreasSettingsCanopy,
  setTreeCoverLossAreasSettingsStartYear,
  setTreeCoverLossAreasSettingsEndYear,
  setTreeCoverLossAreasdIsUpdating
};
