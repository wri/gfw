import { createAction, createThunkAction } from 'redux-tools';
import { DASHBOARDS } from 'router';

export const setShowMapMobile = createAction('setShowMapMobile');

export const handleCategoryChange = createThunkAction(
  'handleCategoryChange',
  category => (dispatch, getState) => {
    const { query, payload } = getState().location;
    dispatch({
      type: DASHBOARDS,
      payload,
      query: {
        ...query,
        category
      }
    });
  }
);
