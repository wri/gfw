import { createThunkAction } from 'redux-tools';
import { postNewsletterSubscription } from 'services/newsletter';

export const onSubmit = createThunkAction(
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
      ...subscriptions
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
        } else {
          console.info(error);
        }
      });
  }
);
