import { createThunkAction } from 'utils/redux';
import { FORM_ERROR } from 'final-form';

import { updateProfile } from 'services/user';
import { setMyGFW } from 'providers/mygfw-provider/actions';

export const saveProfile = createThunkAction(
  'saveProfile',
  ({ id, signUpNewsletterOrTesting, ...rest }) => dispatch => {
    const postData = {
      id,
      ...rest,
      signUpForTesting:
        signUpNewsletterOrTesting &&
        signUpNewsletterOrTesting.indexOf('testing') !== -1
          ? 'true'
          : false,
      signUpForNewsletter:
        signUpNewsletterOrTesting &&
        signUpNewsletterOrTesting.indexOf('newsletter') !== -1
          ? 'true'
          : false
    };

    return updateProfile(id, postData)
      .then(response => {
        if (response.data && response.data.data) {
          const { attributes } = response.data.data;
          dispatch(
            setMyGFW({
              loggedIn: true,
              id: response.data.data.id,
              ...attributes
            })
          );
        }

        return true;
      })
      .catch(error => {
        const { errors } = error.response.data;

        return {
          [FORM_ERROR]: errors[0].detail
        };
      });
  }
);
