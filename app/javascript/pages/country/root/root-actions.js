import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider
} from 'services/country';


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

const getCountries = createThunkAction(
  'getCountries',
  () => dispatch => {
    dispatch(setCountriesLoading(true));
    getCountriesProvider().then(response => {
      setCountries(response.data.rows);
      setCountriesLoading(false);
    });
  }
);

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
