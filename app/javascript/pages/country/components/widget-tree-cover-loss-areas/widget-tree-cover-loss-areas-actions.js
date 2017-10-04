import { createAction } from 'redux-actions';

const setPieCharDataDistricts = createAction('setPieCharDataDistricts');
const setArrayCoverAreasLoss = createAction('setArrayCoverAreasLoss');
const setPieChartDataTotal = createAction('setPieChartDataTotal');

export default {
  setPieCharDataDistricts,
  setArrayCoverAreasLoss,
  setPieChartDataTotal
};
