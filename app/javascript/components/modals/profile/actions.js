import { createAction, createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

// import { updateUserProfile } from 'services/areas';

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
  ({ name, email, sector, lang }) => (dispatch, getState) => {
    const { profile, myGfw } = getState();
    if (profile && !profile.loading) {
      dispatch(setProfileSaving({ saving: true, error: false }));

      const postData = {
        id: '',
        name,
        sector: '',
        language: lang
      };

      // updateUserProfile(postData, 'patch')
      //   .then(response => {
      //     if (response.data && response.data.data) {
      //       setSomething();
      //       dispatch(setProfileSaving({ saving: false, error: false }));
      //     }
      //   })
      //   .catch(error => {
      //     dispatch(
      //       setProfileSaving({
      //         saving: false,
      //         error: true
      //       })
      //     );
      //     console.info(error);
      //   });
    }
  }
);
