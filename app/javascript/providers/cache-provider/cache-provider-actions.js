import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';

import { getKeys } from 'services/cache';

export const setCacheListLoading = createAction('setCacheListLoading');
export const setCacheList = createAction('setCacheList');

export const getCacheList = createThunkAction(
  'getCacheList',
  () => (dispatch, state) => {
    if (!state().cache.cacheListLoading) {
      dispatch(setCacheListLoading(true));
      getKeys()
        .then(response => {
          if (response.data.data.length) {
            dispatch(setCacheList(response.data.data));
          }
        })
        .catch(error => {
          dispatch(setCacheListLoading(false));
          console.info(error);
        });
    }
  }
);
