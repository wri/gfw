import { createAction } from 'redux-actions';

const setInitialState = createAction('setInitialState');
const setIsLoading = createAction('setIsLoading');
const setLocation = createAction('setLocation');
const setAdmin0List = createAction('setAdmin0List');
const setAdmin1List = createAction('setAdmin1List');
const setAdmin2List = createAction('setAdmin2List');
const setLocationName = createAction('setLocationName');
const setFixedMapStatus = createAction('setFixedMapStatus');
const setMapTop = createAction('setMapTop');
const setShowMapMobile = createAction('setShowMapMobile');

export default {
  setInitialState,
  setIsLoading,
  setLocation,
  setAdmin0List,
  setAdmin1List,
  setAdmin2List,
  setLocationName,
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
