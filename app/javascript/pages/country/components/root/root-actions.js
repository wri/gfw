import { createAction } from 'redux-actions';

const setInitialState = createAction('setInitialState');
const setIsLoading = createAction('setIsLoading');
const setIso = createAction('setIso');
const setRegion = createAction('setRegion');
const setCountryData = createAction('setCountryData');
const setCountryRegions = createAction('setCountryRegions');
const setCountriesList = createAction('setCountriesList');
const setPositionMap = createAction('setPositionMap');
const setTopMap = createAction('setTopMap');

export default {
  setInitialState,
  setIsLoading,
  setIso,
  setRegion,
  setCountryData,
  setCountryRegions,
  setCountriesList,
  setPositionMap,
  setTopMap
};
