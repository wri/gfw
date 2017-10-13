import { createAction } from 'redux-actions';

const setPieCharDataAreas = createAction('setPieCharDataAreas');
const setArrayCoverAreasGain = createAction('setArrayCoverAreasGain');
const setPieCharDataAreasTotal = createAction('setPieCharDataAreasTotal');
const setTreeAreasTreeGainSettingsUnit = createAction('setTreeAreasTreeGainSettingsUnit');
const setAreaMostCoverIsUpdating = createAction('setAreaMostCoverIsUpdating');

export default {
  setPieCharDataAreas,
  setArrayCoverAreasGain,
  setPieCharDataAreasTotal,
  setTreeAreasTreeGainSettingsUnit,
  setAreaMostCoverIsUpdating
};
