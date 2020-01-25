import { createThunkAction } from 'redux-tools';
import { FORM_ERROR } from 'final-form';

import { updateUserProfile } from 'services/user';
import { setMyGFW } from 'providers/mygfw-provider/actions';

export const saveProfile = createThunkAction(
  'saveProfile',
  ({ id, signUpForTesting, ...rest }) => dispatch => {
    const postData = {
      id,
      ...rest,
      signUpForTesting:
        signUpForTesting && signUpForTesting[0] === 'yes' ? 'true' : false
    };

    return updateUserProfile(id, postData)
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
