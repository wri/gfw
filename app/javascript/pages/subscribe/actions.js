import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';
import { postNewsletterSubscription } from 'services/newsletter';

export const setSubscribeSaving = createAction('setSubscribeSaving');
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
    const { subscriptionForm } = getState();
    if (subscriptionForm && !subscriptionForm.saving) {
      dispatch(setSubscribeSaving({ saving: true, error: false }));
      const {
        city,
        comments,
        country,
        email,
        firstName,
        lastName,
        organization,
        subscriptions
      } = data;
      const postData = {
        first_name: firstName,
        last_name: lastName,
        email,
        company: organization,
        city,
        country,
        success_location: 'https://www.globalforestwatch.org/thank-you',
        error_location: 'https://www.globalforestwatch.org/thank-you',
        pardot_extra_field: comments,
        gfw_interests: Object.entries(subscriptions)
          .filter(([, val]) => val)
          .map(([key]) => key)
          .join(', ')
      };

      postNewsletterSubscription(
        postData,
        'https://connect.wri.org/l/120942/2019-07-18/4d6vw2'
      )
        .then(() => {
          dispatch(
            setSubscribeSaving({
              saving: false,
              error: false
            })
          );
          dispatch({ type: 'location/THANKYOU' });
        })
        .catch(error => {
          if (!error.response) {
            dispatch({ type: 'location/THANKYOU' });
            dispatch(
              setSubscribeSaving({
                saving: false,
                error: false
              })
            );
          } else {
            dispatch(
              setSubscribeSaving({
                saving: false,
                error: true
              })
            );
            console.info(error);
          }
        });
    }
  }
);
