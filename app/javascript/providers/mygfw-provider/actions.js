import axios from 'axios';
import { createAction, createThunkAction } from 'redux-tools';

export const setMyGFWLoading = createAction('setMyGFWLoading');
export const setMyGFW = createAction('setMyGFW');

export const checkLogged = createThunkAction('checkLogged', () => dispatch => {
  dispatch(setMyGFWLoading({ loading: true, error: false }));
  axios
    .get(`${process.env.GFW_API}/user`, { withCredentials: true })
    .then(response => {
      if (response.status < 400) {
        dispatch(
          setMyGFW({
            ...response.data.data.attributes,
            id: response.data.data.id
          })
        );
      }
    })
    .catch(() => {
      dispatch(setMyGFWLoading({ loading: false, error: true }));
    });
});
