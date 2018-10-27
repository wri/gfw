import axios from 'axios';
import { createAction, createThunkAction } from 'redux-tools';

export const setMyGFWLoading = createAction('setMyGFWLoading');
export const setMyGFW = createAction('setMyGFW');

export const checkLogged = createThunkAction(
  'checkLogged',
  token => (dispatch, getState) => {
    if (!getState().myGfw.loading) {
      dispatch(setMyGFWLoading({ loading: true, error: false }));
      axios
        .get(`${process.env.GFW_API}/user`, { withCredentials: true })
        .then(response => {
          if (response.status < 400) {
            dispatch(
              setMyGFW({
                ...response.data.data.attributes,
                id: response.data.data.id,
                token
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

export const setToken = createThunkAction(
  'setToken',
  token => (dispatch, getState) => {
    localStorage.setItem('mygfw_token', token);
    const { type, query, payload } = getState().location;
    dispatch({
      type,
      payload,
      query: {
        ...query,
        token: undefined
      }
    });
  }
);
