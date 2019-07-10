import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { postAreasProvider } from 'services/areas';

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
      const postData = {
        name,
        application: 'gfw',
        // image: '',
        // geostore: null,
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
