import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { postAreasProvider } from 'services/areas';

import { MAP } from 'router';

export const setSaveAOISaving = createAction('setSaveAOISaving');
export const setSaveAOISaved = createAction('setSaveAOISaved');
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

export const saveAOI = createThunkAction(
  'saveAOI',
  data => (dispatch, getState) => {
    const { modalSaveAOI, geostore, location } = getState();
    const { query, payload } = location;
    const { mainMap } = query || {};

    // TODO: check redirect
    // console.log(query, payload);

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

      postAreasProvider(token, postData)
        .then(response => {
          dispatch(setSaveAOISaved());
          // dispatch action to change URL to /map/aoi/response.aoi-id
          dispatch({
            type: MAP,
            payload: {
              type: 'aoi',
              adm0: response.data.data.id,
              ...payload
            },
            query: {
              ...query,
              mainMap: {
                ...mainMap,
                showAnalysis: true
              }
            }
          });
          // save AOI in the store => for analysis AND the myGFW menu
          // async await ? or thunkaction
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
