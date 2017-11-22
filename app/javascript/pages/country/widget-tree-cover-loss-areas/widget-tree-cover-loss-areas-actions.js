import { createAction } from 'redux-actions';

const setPieCharDataDistricts = createAction('setPieCharDataDistricts');
const setPieChartDataTotal = createAction('setPieChartDataTotal');

const setTreeCoverLossAreasSettingsUnit = createAction(
  'setTreeCoverLossAreasSettingsUnit'
);
const setTreeCoverLossAreasSettingsCanopy = createAction(
  'setTreeCoverLossAreasSettingsCanopyl'
);
const setTreeCoverLossAreasSettingsStartYear = createAction(
  'setTreeCoverLossAreasSettingsStartYear'
);
const setTreeCoverLossAreasSettingsEndYear = createAction(
  'setTreeCoverLossAreasSettingsEndYear'
);
const setTreeCoverLossAreasIsLoading = createAction(
  'setTreeCoverLossAreasIsLoading'
);
const setTreeCoverLossAreasPage = createAction('setTreeCoverLossAreasPage');

export default {
  setPieCharDataDistricts,
  setPieChartDataTotal,
  setTreeCoverLossAreasSettingsUnit,
  setTreeCoverLossAreasSettingsCanopy,
  setTreeCoverLossAreasSettingsStartYear,
  setTreeCoverLossAreasSettingsEndYear,
  setTreeCoverLossAreasIsLoading,
  setTreeCoverLossAreasPage
};
