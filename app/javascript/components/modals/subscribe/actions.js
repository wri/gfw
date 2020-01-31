import { createAction, createThunkAction } from 'utils/redux';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { saveSubscription as postSubscription } from 'services/subscriptions';

export const setSubscribeSaving = createAction('setSubscribeSaving');
export const setSubscribeSaved = createAction('setSubscribeSaved');
export const resetSubscribe = createAction('resetSubscribe');
export const clearSubscribeError = createAction('clearSubscribeError');

export const setSubscribeSettings = createThunkAction(
  'setSubscribeSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'subscribe',
        change,
        state
      })
    )
);

export const saveSubscription = createThunkAction(
  'saveSubscription',
  data => (dispatch, getState) => {
    const { modalSubscribe } = getState();
    if (modalSubscribe && !modalSubscribe.saving) {
      dispatch(setSubscribeSaving({ saving: true, error: false }));
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
          dispatch(setSubscribeSaved());
        })
        .catch(error => {
          dispatch(
            setSubscribeSaving({
              saving: false,
              error: true
            })
          );
          console.info(error);
        });
    }
  }
);
