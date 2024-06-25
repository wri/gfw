import { createAction, createThunkAction } from 'redux/actions';

import { checkLoggedIn, getProfile } from 'services/user';
import { checkUserProfileFilled } from 'utils/user';

const isServer = typeof window === 'undefined';

export const setMyGFWLoading = createAction('setMyGFWLoading');
export const setMyGFW = createAction('setMyGFW');

export const getUserProfile = createThunkAction(
  'getUserProfile',
  (urlToken) => (dispatch) => {
    let isTokenExpired = false;
    const tokenExpiration = localStorage.getItem('userTokenExpirationDate');
    const token = !isServer && (urlToken || localStorage.getItem('userToken'));

    if (!tokenExpiration || new Date(tokenExpiration) <= new Date()) {
      isTokenExpired = true;
    }

    if (token && !isTokenExpired) {
      dispatch(setMyGFWLoading({ loading: true, error: false }));
      checkLoggedIn(token)
        .then((authResponse) => {
          getProfile(authResponse.data.id)
            .then((response) => {
              if (response.status < 400 && response.data) {
                const { data } = response.data;
                dispatch(
                  setMyGFW({
                    loggedIn: true,
                    id: authResponse.data.id,
                    isUserProfileFilled: true,
                    ...(data && data.attributes),
                    ...(data && data.attributes.applicationData.gfw),
                  })
                );
              }
            })
            .catch(() => {
              dispatch(
                setMyGFW({
                  loggedIn: true,
                  isUserProfileFilled: checkUserProfileFilled(
                    authResponse.data
                  ),
                  ...authResponse.data,
                })
              );
            });
        })
        .catch(() => {
          dispatch(setMyGFWLoading({ loading: false, error: true }));
        });
    } else {
      dispatch(setMyGFWLoading({ loading: false, error: false }));
    }
  }
);
