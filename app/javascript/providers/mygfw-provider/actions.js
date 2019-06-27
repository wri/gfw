import axios from 'axios';
import { createAction, createThunkAction } from 'redux-tools';

export const setMyGFWLoading = createAction('setMyGFWLoading');
export const setMyGFW = createAction('setMyGFW');

export const checkLogged = createThunkAction(
  'checkLogged',
  () => (dispatch, state) => {
    const { myGfw } = state();
    if (myGfw && !myGfw.loading) {
      dispatch(setMyGFWLoading({ loading: true, error: false }));
      axios
        .get(`${process.env.GFW_API}/user`, { withCredentials: true })
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
