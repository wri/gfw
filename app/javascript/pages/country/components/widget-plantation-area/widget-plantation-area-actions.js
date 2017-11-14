import { createAction } from 'redux-actions';

const setPlantationAreaIsLoading = createAction('setPlantationAreaIsLoading');
const setPlantationAreaData = createAction('setPlantationAreaData');
const setPlantationAreaPage = createAction('setPlantationAreaPage');
const setPlantationAreaSettingsUnit = createAction('setPlantationAreaSettingsUnit');

export default {
  setPlantationAreaIsLoading,
  setPlantationAreaData,
  setPlantationAreaPage,
  setPlantationAreaSettingsUnit
};
