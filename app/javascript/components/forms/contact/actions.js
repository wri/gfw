import { createThunkAction } from 'redux-tools';

import { submitContactForm } from 'services/forms';

export const sendContactForm = createThunkAction(
  'sendContactForm',
  data => () =>
    submitContactForm(data)
      .then(() => {})
      .catch(error => {
        console.error(error);
      })
);
