import { createAction, createThunkAction } from 'redux-tools';
import { FORM_ERROR } from 'final-form';

import { checkLoggedIn, login } from 'services/user';

export const setMyGFWLoading = createAction('setMyGFWLoading');
export const setMyGFW = createAction('setMyGFW');

export const getUserProfile = createThunkAction('checkAuth', () => dispatch => {
  dispatch(setMyGFWLoading({ loading: true, error: false }));
  const token = localStorage.getItem('userToken');
  if (token) {
    checkLoggedIn(token)
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
  } else {
    dispatch(setMyGFWLoading({ loading: false, error: true }));
  }
});

export const logUserIn = createThunkAction('logUserIn', data => dispatch =>
  login(data)
    .then(response => {
      if (response.status < 400 && response.data) {
        dispatch(getUserProfile());
      }
    })
    .catch(error => {
      const { errors } = error.response.data;

      return {
        [FORM_ERROR]: errors[0].detail
      };
    })
);
