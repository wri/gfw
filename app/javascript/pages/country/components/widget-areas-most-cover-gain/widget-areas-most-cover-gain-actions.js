import { createAction } from 'redux-actions';

const setPieCharDataAreas = createAction('setPieCharDataAreas');
const setArrayCoverAreasGain = createAction('setArrayCoverAreasGain');
const setPieCharDataAreasTotal = createAction('setPieCharDataAreasTotal');
const setTreeLocatedSettingsUnit = createAction('setTreeLocatedSettingsUnit');
const setAreaMostCoverIsUpdating = createAction('setAreaMostCoverIsUpdating');

export default {
  setPieCharDataAreas,
  setArrayCoverAreasGain,
  setPieCharDataAreasTotal,
  setTreeLocatedSettingsUnit,
  setAreaMostCoverIsUpdating
};
