import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import axios from 'axios';
import { parseGadm36Id } from 'utils/format';
import { MAP } from 'router';

export const setLocationsData = createAction('setLocationsData');
export const setLocationsLoading = createAction('setLocationsLoading');

export const setMenuSettings = createThunkAction(
  'setMenuSettings',
  change => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'menu',
        change,
        state
      })
    );
  }
);

export const getLocationFromSearch = createThunkAction(
  'getLocationFromSearch',
  search => dispatch => {
    dispatch(setLocationsLoading(true));
    axios
      .get(
        `${
          process.env.CARTO_API
        }/sql?q=SELECT iso, gid_1, gid_2, name_0, name_1, name_2, CONCAT(name_2, ', ', name_1, ', ', name_0) as label FROM gadm36_adm2 WHERE LOWER(name_0) LIKE '%25${
          search
        }%25' OR LOWER(name_1) LIKE '%25${
          search
        }%25' OR LOWER(name_2) LIKE '%25${
          search
        }%25' OR LOWER(CONCAT(name_2, ', ', name_1, ', ', name_0)) LIKE '%25${
          search
        }%25' AND type_2 NOT IN ('Waterbody', 'Water body', 'Water Body')`
      )
      .then(response => {
        if (response.data.rows && response.data.rows.length) {
          const locations = response.data.rows.slice(0, 10);
          dispatch(setLocationsData(locations));
        } else {
          dispatch(setLocationsData([]));
        }
        dispatch(setLocationsLoading(false));
      })
      .catch(error => {
        console.info(error);
        dispatch(setLocationsLoading(false));
      });
  }
);

export const handleClickLocation = createThunkAction(
  'handleClickLocation',
  ({ iso, gid_1, gid_2 }) => (dispatch, getState) => {
    const query = getState().location.query || {};
    const location = parseGadm36Id(gid_2 || gid_1 || iso);
    dispatch({
      type: MAP,
      payload: {
        type: 'country',
        ...location
      },
      query: {
        ...query,
        map: {
          ...(query && query.map && query.map),
          canBound: true
        },
        analysis: {
          ...(query && query.analysis && query.analysis),
          showAnalysis: true
        }
      }
    });
  }
);
