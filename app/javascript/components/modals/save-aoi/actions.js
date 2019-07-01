import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { postSubscription } from 'services/subscriptions';

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

export const saveAOISettings = createThunkAction(
  'saveSubscription',
  data => (dispatch, getState) => {
    const { modalSaveAOI } = getState();
    if (modalSaveAOI && !modalSaveAOI.saving) {
      dispatch(setSaveAOISaving({ saving: true, error: false }));
      const {
        name,
        userData,
        email,
        datasets,
        type,
        adm0,
        adm1,
        adm2,
        lang
      } = data;
      const isCountry = type === 'country';
      const isUse = type === 'use';
      const postData = {
        name,
        resource: {
          type: 'EMAIL',
          content: email
        },
        language: lang,
        datasets,
        params: {
          iso: {
            region: isCountry ? adm1 : null,
            subRegion: isCountry ? adm2 : null,
            country: isCountry ? adm0 : null
          },
          geostore: type === 'geostore' ? adm0 : null,
          use: isUse ? adm0 : null,
          useid: isUse ? adm1 : null,
          wdpaid: type === 'wdpa' ? adm0 : null
        }
      };

      postSubscription(JSON.stringify(postData), userData.token)
        .then(() => {
          dispatch(setSaveAOISaved());
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
