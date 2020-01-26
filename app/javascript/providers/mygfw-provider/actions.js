import { createAction, createThunkAction } from 'utils/redux';

import { getProfile } from 'services/user';

export const setMyGFWLoading = createAction('setMyGFWLoading');
export const setMyGFW = createAction('setMyGFW');

export const getUserProfile = createThunkAction(
  'getUserProfile',
  () => dispatch => {
    const token = localStorage.getItem('userToken');
    if (token) {
      dispatch(setMyGFWLoading({ loading: true, error: false }));
      getProfile()
        .then(response => {
          if (response.status < 400 && response.data) {
            const { data } = response.data;
            dispatch(
              setMyGFW({
                loggedIn: true,
                ...(data && data.attributes),
                id: data && data.id
              })
            );
          }
        })
        .catch(() => {
          dispatch(setMyGFWLoading({ loading: false, error: true }));
        });
    }
  }
);
