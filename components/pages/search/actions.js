import { createThunkAction, createAction } from 'redux/actions';

import { getSearchQuery } from 'services/search';

export const setSearchData = createAction('setSearchData');
export const setSearchQuery = createAction('setSearchQuery');
export const setSearchLoading = createAction('setSearchLoading');

export const getSearch = createThunkAction(
  'getSearch',
  ({ query, page }) => (dispatch) => {
    if (query) {
      dispatch(setSearchLoading(true));
      getSearchQuery({ query, page })
        .then((response) => {
          const { items } = response.data || {};
          dispatch(setSearchData(items || []));
        })
        .catch(() => {
          dispatch(setSearchLoading(false));
        });
    }
  }
);
