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

/*

  changesEmail: true
  email: "daniel.fernandez@vizzuality.com"
  lang: "en"
  monthlyEmail: true
  name: "Iceland"
  receiveAlerts: false
  tags: []
*/

export const saveAOI = createThunkAction(
  'saveAOI',
  data => (dispatch, getState) => {
    const { modalSaveAOI } = getState();
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
      const isUse = type === 'use';
      const postData = {
        name,
        application: 'gfw',
        // image: '',
        userId: '',
        geostore: type === 'geostore' ? adm0 : null,
        resource: {
          type: 'EMAIL',
          content: email
        },
        language: lang,
        params: {
          iso: {
            region: isCountry ? adm1 : null,
            subRegion: isCountry ? adm2 : null,
            country: isCountry ? adm0 : null
          },
          use: isUse ? adm0 : null,
          changesEmail,
          monthlyEmail,
          receiveAlerts,
          tags
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
