import { createThunkAction, createAction } from 'utils/redux';
import request from 'utils/request';

export const setSearchData = createAction('setSearchData');
export const setSearchLoading = createAction('setSearchLoading');
export const setSearchQuery = createAction('setSearchQuery');

export const getSearch = createThunkAction(
  'getSearch',
  ({ query, page }) => (dispatch, getState) => {
    const { search } = getState() || {};
    if (query && search && !search.loading) {
      dispatch(setSearchLoading(true));
      request
        .get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: process.env.GOOGLE_SEARCH_API_KEY,
            cx: process.env.GOOGLE_CUSTOM_SEARCH_CX,
            q: query,
            start: page || 1,
            filter: 0,
          },
        })
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
