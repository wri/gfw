import { createAction } from 'redux-actions';

const setInitialState = createAction('setInitialState');
const setIsLoading = createAction('setIsLoading');
const setIso = createAction('setIso');
const setRegion = createAction('setRegion');
const setNameRegion = createAction('setNameRegion');
const setCountryData = createAction('setCountryData');
const setCountryRegions = createAction('setCountryRegions');
const setCountriesList = createAction('setCountriesList');
const setPositionMap = createAction('setPositionMap');
const setTopMap = createAction('setTopMap');
const setPositionPage = createAction('setPositionPage');
const setShowMapMobile = createAction('setShowMapMobile');

export default {
  setInitialState,
  setIsLoading,
  setIso,
  setRegion,
  setNameRegion,
  setCountryData,
  setCountryRegions,
  setCountriesList,
  setPositionMap,
  setTopMap,
  setPositionPage,
  setShowMapMobile
};
