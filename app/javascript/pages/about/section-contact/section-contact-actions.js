import { createAction, createThunkAction } from 'vizzuality-redux-tools';
import { submitContactForm } from 'services/forms';

export const setShowConfirm = createAction('setShowConfirm');
export const setFormSubmitting = createAction('setFormSubmitting');

export const sendContactForm = createThunkAction(
  'sendContactForm',
  data => dispatch => {
    dispatch(setFormSubmitting({ submitting: true, error: false }));
    submitContactForm(data)
      .then(() => {
        dispatch(setShowConfirm(true));
      })
      .catch(error => {
        console.error(error);
        dispatch(setFormSubmitting({ submitting: false, error: true }));
      });
  }
);
