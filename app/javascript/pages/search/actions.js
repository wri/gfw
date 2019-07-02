import { createThunkAction, createAction } from 'redux-tools';
import axios from 'axios';
// import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setSearchData = createAction('setSearchData');
export const setSearchLoading = createAction('setSearchLoading');

export const getSearch = createThunkAction(
  'getSearch',
  ({ query, page }) => (dispatch, getState) => {
    const { search } = getState() || {};
    if (query && search && !search.loading) {
      dispatch(setSearchLoading(true));
      axios
        .get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: process.env.GOOGLE_SEARCH_API_KEY,
            cx: process.env.GOOGLE_CUSTOM_SEARCH_CX,
            q: query,
            start: page || 1,
            filter: 0
          }
        })
        .then(response => {
          const { items } = response.data || {};
          dispatch(setSearchData(items || []));
        })
        .catch(error => {
          dispatch(setSearchLoading(false));
          console.error(error);
        });
    }
  }
);
