import { createThunkAction } from 'redux-tools';
import { postNewsletterSubscription } from 'services/newsletter';
import { FORM_ERROR } from 'final-form';

export const saveNewsletterSubscription = createThunkAction(
  'saveNewsletterSubscription',
  values => dispatch => {
    const {
      firstName,
      lastName,
      email,
      organization,
      city,
      country,
      comments,
      subscriptions
    } = values;

    const postData = {
      first_name: firstName,
      last_name: lastName,
      email,
      company: organization,
      city,
      country,
      gfw_interests: Object.entries(subscriptions)
        .filter(([, val]) => val)
        .map(([key]) => key)
        .join(', '),
      pardot_extra_field: comments
    };

    return postNewsletterSubscription(postData)
      .then(() => {
        dispatch({ type: 'location/THANKYOU' });
      })
      .catch(error => {
        if (!error.response) {
          dispatch({ type: 'location/THANKYOU' });
          return true;
        }

        return {
          [FORM_ERROR]: 'Service unavailable'
        };
      });
  }
);
