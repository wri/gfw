import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import { submitContactForm } from 'services/forms';

export const setShowConfirm = createAction('setShowConfirm');
export const setFormSubmitting = createAction('setFormSubmitting');

export const sendContactForm = createThunkAction(
  'sendContactForm',
  () => dispatch => {
    dispatch(setFormSubmitting({ submitting: true, error: false }));
    submitContactForm()
      .then(() => {
        dispatch(setShowConfirm(true));
      })
      .catch(error => {
        console.error(error);
        dispatch(setFormSubmitting({ submitting: false, error: true }));
      });
  }
);
