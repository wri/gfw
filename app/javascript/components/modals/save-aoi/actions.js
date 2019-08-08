import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { setAreasProvider, deleteAreaProvider } from 'services/areas';
import {
  setArea,
  setAreas,
  setActiveArea
} from 'providers/areas-provider/actions';
import { setDrawnGeostore } from 'pages/map/actions';

import { MAP } from 'router';

export const setSaveAOISaving = createAction('setSaveAOISaving');
export const setSaveAOISaved = createAction('setSaveAOISaved');
export const setSaveAOIDeleted = createAction('setSaveAOIDeleted');
export const resetSaveAOI = createAction('resetSaveAOI');
export const clearSaveAOIError = createAction('clearSaveAOIError');

export const setSaveAOISettings = createThunkAction(
  'setSaveAOISettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'saveAOI',
        change,
        state
      })
    )
);

export const goToAOI = createThunkAction(
  'goToAOI',
  area => (dispatch, getState) => {
    const { id } = area;
    const { location } = getState();
    if (id && location) {
      const { query, payload } = location;
      const { mainMap, map } = query || {};
      dispatch(setActiveArea(area));
      dispatch({
        type: MAP,
        payload: {
          ...payload,
          type: 'aoi',
          adm0: id
        },
        query: {
          ...query,
          mainMap: {
            ...mainMap,
            showAnalysis: true
          },
          map: {
            ...map,
            canBound: true
          }
        }
      });
    }
  }
);

export const deleteAOI = createThunkAction(
  'deleteAOI',
  data => (dispatch, getState) => {
    const { areas } = getState();
    const { activeArea, data: aois } = areas || {};
    const { id, geostore } = activeArea;
    const { userData } = data;
    const token = userData.token || process.env.DEMO_USER_TOKEN;

    deleteAreaProvider(token, id)
      .then(response => {
        if (
          response.status &&
          response.status >= 200 &&
          response.status < 300
        ) {
          dispatch(setSaveAOIDeleted()); // show deleted message
          dispatch(setDrawnGeostore(geostore)); // goto geostore view
          dispatch(setAreas(aois.filter(a => a.id !== activeArea.id))); // delete area from state.areas
        }
      })
      .catch(error => {
        dispatch(
          setSaveAOISaving({
            saving: false,
            error: true
          })
        );
        console.info(error);
      });
  }
);

export const saveAOI = createThunkAction(
  'saveAOI',
  data => (dispatch, getState) => {
    const { modalSaveAOI, geostore, areas } = getState();
    const { activeArea } = areas || {};

    if (modalSaveAOI && !modalSaveAOI.saving) {
      dispatch(setSaveAOISaving({ saving: true, error: false }));
      const {
        name,
        userData,
        email,
        type,
        adm0,
        adm1,
        adm2,
        lang,
        changesEmail,
        monthlyEmail,
        receiveAlerts,
        tags
      } = data;
      const isCountry = type === 'country';
      const postData = {
        name,
        id: activeArea && activeArea.id,
        application: 'gfw',
        geostore: geostore && geostore.data && geostore.data.id,
        resource: {
          type: 'EMAIL',
          content: email
        },
        language: lang,
        iso: {
          region: isCountry ? adm1 : null,
          subRegion: isCountry ? adm2 : null,
          country: isCountry ? adm0 : null
        },
        use: {},
        changesEmail,
        monthlyEmail,
        receiveAlerts,
        tags
      };

      const token = userData.token || process.env.DEMO_USER_TOKEN;
      const method = areas && areas.activeArea ? 'patch' : 'post';

      setAreasProvider(token, postData, method)
        .then(response => {
          if (response.data && response.data.data) {
            const area = response.data.data;
            const { id, attributes } = area;

            dispatch(setSaveAOISaved()); // shows saved modal
            dispatch(goToAOI(area)); // moves to AOI in the map
            dispatch(setArea({ id, ...attributes })); // saves AOI in the store
          }
        })
        .catch(error => {
          dispatch(
            setSaveAOISaving({
              saving: false,
              error: true
            })
          );
          console.info(error);
        });
    }
  }
);
