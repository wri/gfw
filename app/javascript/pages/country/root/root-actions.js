import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider
} from 'services/country';
import { getGeostoreProvider } from 'services/geostore';

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

const getCountries = createThunkAction('getCountries', () => dispatch => {
  dispatch(setCountriesLoading(true));
  getCountriesProvider().then(response => {
    dispatch(setCountries(response.data.rows));
    dispatch(setCountriesLoading(false));
  });
});

const getRegions = createThunkAction('getRegions', country => dispatch => {
  dispatch(setRegionsLoading(true));
  getRegionsProvider(country).then(response => {
    dispatch(setRegions(response.data.rows));
    dispatch(setRegionsLoading(false));
  });
});

const getSubRegions = createThunkAction(
  'getSubRegions',
  (country, region) => dispatch => {
    dispatch(setSubRegionsLoading(true));
    getSubRegionsProvider(country, region).then(response => {
      dispatch(setSubRegions(response.data.rows));
      dispatch(setSubRegionsLoading(false));
    });
  }
);

const getGeostore = createThunkAction(
  'getGeostore',
  (country, region, subRegion) => dispatch => {
    dispatch(setGeostoreLoading(true));
    getGeostoreProvider(country, region, subRegion).then(response => {
      const { areaHa, bbox } = response.data.data.attributes;
      dispatch(
        setGeostore({
          areaHa,
          bounds: getBoxBounds(bbox)
        })
      );
      dispatch(setGeostoreLoading(false));
    });
  }
);

const getBoxBounds = cornerBounds => [
  [cornerBounds[0], cornerBounds[1]],
  [cornerBounds[0], cornerBounds[3]],
  [cornerBounds[2], cornerBounds[3]],
  [cornerBounds[2], cornerBounds[1]],
  [cornerBounds[0], cornerBounds[1]]
];

export default {
  getCountries,
  getRegions,
  getSubRegions,
  getGeostore,
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
