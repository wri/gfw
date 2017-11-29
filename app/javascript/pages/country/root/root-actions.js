import { createAction } from 'redux-actions';

const setCountriesLoading = createAction('setCountriesLoading');
const setRegionsLoading = createAction('setRegionsLoading');
const setSubRegionsLoading = createAction('setSubRegionsLoading');
const setGeostoreLoading = createAction('setGeostoreLoading');

const setCountries = createAction('setCountries');
const setRegions = createAction('setRegions');
const setSubRegions = createAction('setSubRegions');
const setGeostore = createAction('setGeostore');
const setFixedMapStatus = createAction('setFixedMapStatus');
const setMapTop = createAction('setMapTop');
const setShowMapMobile = createAction('setShowMapMobile');

export default {
  setCountriesLoading,
  setRegionsLoading,
  setSubRegionsLoading,
  setGeostoreLoading,
  setCountries,
  setRegions,
  setSubRegions,
  setGeostore,
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile
};
