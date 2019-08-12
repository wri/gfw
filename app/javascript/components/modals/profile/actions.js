import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

import { updateUserProfile } from 'services/user';
import { setMyGFW } from 'providers/mygfw-provider/actions';

export const setProfileSaving = createAction('setProfileSaving');

export const setProfileSettings = createThunkAction(
  'setProfileSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'profile',
        change,
        state
      })
    )
);

export const saveProfile = createThunkAction(
  'saveProfile',
  ({
    id,
    name,
    email,
    lang,
    sector,
    primaryResponsibilities,
    howDoYouUse,
    country,
    city,
    state,
    signUpForTesting
  }) => (dispatch, getState) => {
    const { profile } = getState();
    if (profile && !profile.saving) {
      dispatch(setProfileSaving({ saving: true, error: false }));

      const postData = {
        id,
        fullName: name,
        email,
        language: lang,
        sector,
        primaryResponsibilities,
        howDoYouUse,
        country,
        city,
        state,
        signUpForTesting: signUpForTesting ? 'true' : false
      };

      updateUserProfile(id, postData)
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
            dispatch(setProfileSaving({ saving: false, error: false }));
          }
        })
        .catch(error => {
          dispatch(
            setProfileSaving({
              saving: false,
              error: true
            })
          );
          console.info(error);
        });
    }
  }
);
