import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { postSubscription } from 'services/subscriptions';

export const setSubscribeSaving = createAction('setSubscribeSaving');
export const setSubscribeSaved = createAction('setSubscribeSaved');
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
    if (!getState().modalSubscribe.saving) {
      dispatch(setSubscribeSaving({ saving: true, error: false }));
      postSubscription(data)
        .then(() => {
          setSubscribeSaved(true);
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
