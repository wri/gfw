import { createAction, createThunkAction } from 'redux/actions';
import { fetchGeocodeLocations } from 'services/geocoding';

import { setMapSettings } from 'components/map/actions';
import { setAnalysisSettings } from 'components/analysis/actions';

export const setLocationsData = createAction('setLocationsData');
export const setMenuLoading = createAction('setMenuLoading');
export const setMenuSettings = createAction('setMenuSettings');

export const getLocationFromSearch = createThunkAction(
  'getLocationFromSearch',
  ({ search, token, lang }) =>
    (dispatch) => {
      dispatch(setMenuLoading(true));
      if (search) {
        fetchGeocodeLocations(search, lang, token)
          .then((locations) => {
            if (locations?.length) {
              dispatch(setLocationsData(locations));
            } else {
              dispatch(setLocationsData([]));
            }
            dispatch(setMenuLoading(false));
          })
          .catch(() => {
            dispatch(setMenuLoading(false));
          });
      }
    }
);

export const handleClickLocation = createThunkAction(
  'handleClickLocation',
  ({ center, bbox: featureBbox }) =>
    (dispatch) => {
      if (featureBbox) {
        dispatch(setMapSettings({ canBound: true, bbox: featureBbox }));
      } else {
        dispatch(
          setMapSettings({
            center: { lat: center[1], lng: center[0] },
            zoom: 12,
          })
        );
      }

      dispatch(setMenuSettings({ menuSection: '' }));
    }
);

export const handleViewOnMap = createThunkAction(
  'handleViewOnMap',
  ({ analysis, mapMenu, map }) =>
    (dispatch) => {
      if (map) {
        dispatch(setMapSettings({ ...map, canBound: true }));
      }

      dispatch(
        setMenuSettings({
          ...mapMenu,
          menuSection: '',
        })
      );

      if (analysis) {
        dispatch(setAnalysisSettings(analysis));
      }
    }
);

export const showAnalysis = createThunkAction(
  'showAnalysis',
  () => (dispatch) => {
    dispatch(
      setMenuSettings({
        menuSection: 'analysis',
      })
    );
  }
);
