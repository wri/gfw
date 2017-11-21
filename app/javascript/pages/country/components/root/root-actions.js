import { createAction } from 'redux-actions';

const setInitialState = createAction('setInitialState');
const setIsLoading = createAction('setIsLoading');
const setIso = createAction('setIso');
const setRegion = createAction('setRegion');
const setNameRegion = createAction('setNameRegion');
const setCountryData = createAction('setCountryData');
const setCountryRegions = createAction('setCountryRegions');
const setCountriesList = createAction('setCountriesList');
const setFixedMapStatus = createAction('setFixedMapStatus');
const setMapTop = createAction('setMapTop');
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
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
