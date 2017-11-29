import { createAction } from 'redux-actions';

const setIsLoading = createAction('setIsLoading');
const setCountries = createAction('setCountries');
const setRegions = createAction('setRegions');
const setSubRegions = createAction('setSubRegions');
const setGeostore = createAction('setGeostore');
const setFixedMapStatus = createAction('setFixedMapStatus');
const setMapTop = createAction('setMapTop');
const setShowMapMobile = createAction('setShowMapMobile');

export default {
  setIsLoading,
  setCountries,
  setRegions,
  setSubRegions,
  setGeostore,
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
