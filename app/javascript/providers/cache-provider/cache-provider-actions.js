import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getKeys } from 'services/cache';

export const setCacheList = createAction('setCacheList');
export const setCacheError = createAction('setCacheError');

export const getCacheList = createThunkAction(
  'getCacheList',
  () => dispatch => {
    getKeys()
      .then(response => {
        if (response.data.data) {
          dispatch(setCacheList(response.data.data));
        } else {
          dispatch(setCacheError(true));
        }
      })
      .catch(error => {
        dispatch(setCacheError(true));
        console.info(error);
      });
  }
);
