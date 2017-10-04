import { createAction } from 'redux-actions';

const setPieCharDataAreas = createAction('setPieCharDataAreas');
const setArrayCoverAreasGain = createAction('setArrayCoverAreasGain');
const setPieCharDataAreasTotal = createAction('setPieCharDataAreasTotal');

export default {
  setPieCharDataAreas,
  setArrayCoverAreasGain,
  setPieCharDataAreasTotal
};
