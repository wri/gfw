import { createThunkAction } from 'redux-tools';

import { loginUser, registerUser, resetPassword } from 'services/user';

export const sendLoginForm = createThunkAction('sendLoginForm', data => () =>
  loginUser(data)
    .then(() => {})
    .catch(error => {
      console.error(error);
    })
);

export const sendRegisterUser = createThunkAction(
  'sendRegisterUser',
  data => () =>
    registerUser(data)
      .then(() => {})
      .catch(error => {
        console.error(error);
      })
);

export const sendResetPassword = createThunkAction(
  'sendResetPassword',
  data => () =>
    resetPassword(data)
      .then(() => {})
      .catch(error => {
        console.error(error);
      })
);
