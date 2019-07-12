import { createThunkAction } from 'redux-tools';
import { SEARCH } from 'router';

export const setQueryToUrl = createThunkAction(
  'setQueryToUrl',
  ({ query }) => (dispatch, getState) => {
    const { location } = getState();
    const { query: oldQuery } = location || {};
    dispatch({
      type: SEARCH,
      query: {
        ...oldQuery,
        query
      }
    });
  }
);
