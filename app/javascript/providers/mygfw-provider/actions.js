import { createAction, createThunkAction } from 'utils/redux';

import { checkLoggedIn, getProfile } from 'services/user';

export const setMyGFWLoading = createAction('setMyGFWLoading');
export const setMyGFW = createAction('setMyGFW');

export const getUserProfile = createThunkAction(
  'getUserProfile',
  (urlToken) => (dispatch) => {
    const token = urlToken || localStorage.getItem('userToken');
    if (token) {
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
                    ...(data && data.attributes),
                  })
                );
              }
            })
            .catch(() => {
              dispatch(
                setMyGFW({
                  loggedIn: true,
                  ...authResponse.data,
                })
              );
            });
        })
        .catch(() => {
          dispatch(setMyGFWLoading({ loading: false, error: true }));
        });
    } else {
      dispatch(setMyGFWLoading({ loading: false, error: true }));
    }
  }
);
