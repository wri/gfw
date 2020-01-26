import { createThunkAction } from 'redux-tools';
import { FORM_ERROR } from 'final-form';

import { register, resetPassword } from 'services/user';

export const sendRegisterUser = createThunkAction(
  'sendRegisterUser',
  data => () =>
    register(data)
      .then(() => {})
      .catch(error => {
        const { errors } = error.response.data;

        return {
          [FORM_ERROR]: errors[0].detail
        };
      })
);

export const sendResetPassword = createThunkAction(
  'sendResetPassword',
  ({ data, success }) => () =>
    resetPassword(data)
      .then(() => {
        success();
      })
      .catch(error => {
        const { errors } = error.response.data;

        return {
          [FORM_ERROR]: errors[0].detail
        };
      })
);
