import { createAction } from 'redux-actions';

const setInitialState = createAction('setInitialState');
const setIsLoading = createAction('setIsLoading');
const setAdmin0List = createAction('setAdmin0List');
const setAdmin1List = createAction('setAdmin1List');
const setAdmin2List = createAction('setAdmin2List');
const setLocationNames = createAction('setLocationNames');
const setGeostore = createAction('setGeostore');
const setFixedMapStatus = createAction('setFixedMapStatus');
const setMapTop = createAction('setMapTop');
const setShowMapMobile = createAction('setShowMapMobile');

export default {
  setInitialState,
  setIsLoading,
  setAdmin0List,
  setAdmin1List,
  setAdmin2List,
  setLocationNames,
  setGeostore,
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
