import { createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

import { submitContactForm } from 'services/forms';

export const setModalContactUsOpen = createThunkAction(
  'setModalContactUsOpen',
  isOpen => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'contactUs',
        change: isOpen,
        state
      })
    );
  }
);

export const sendContactForm = createThunkAction(
  'sendContactForm',
  data => () =>
    submitContactForm(data).catch(error => {
      console.error(error);
    })
);
