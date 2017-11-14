import { createAction } from 'redux-actions';

const setTotalAreaPlantationsIsLoading = createAction('setTotalAreaPlantationsIsLoading');
const setTotalAreaPlantationsValues = createAction('setTotalAreaPlantationsValues');
const setTotalAreaPlantationsSettingsUnit = createAction('setTotalAreaPlantationsSettingsUnit');

export default {
  setTotalAreaPlantationsIsLoading,
  setTotalAreaPlantationsValues,
  setTotalAreaPlantationsSettingsUnit
};
