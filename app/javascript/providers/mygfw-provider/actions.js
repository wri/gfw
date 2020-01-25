import { createAction, createThunkAction } from 'redux-tools';
import { FORM_ERROR } from 'final-form';

import { checkLogged, loginUser } from 'services/user';

export const setMyGFWLoading = createAction('setMyGFWLoading');
export const setMyGFW = createAction('setMyGFW');

export const checkAuth = createThunkAction('checkAuth', () => dispatch => {
  dispatch(setMyGFWLoading({ loading: true, error: false }));
  const token = localStorage.getItem('userToken');
  if (token) {
    checkLogged(token)
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
  loginUser(data)
    .then(response => {
      if (response.status < 400 && response.data) {
        const { data: userData } = response.data;
        localStorage.setItem('userToken', userData.token);
        dispatch(
          setMyGFW({
            loggedIn: true,
            ...userData
          })
        );
      }
    })
    .catch(error => {
      const { errors } = error.response.data;

      return {
        [FORM_ERROR]: errors[0].detail
      };
    })
);
