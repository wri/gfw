import { createAction, createThunkAction } from 'redux-tools';

export const setShowMapMobile = createAction('setShowMapMobile');

export const handleCategoryChange = createThunkAction(
  'handleCategoryChange',
  category => (dispatch, getState) => {
    const { query, type, payload } = getState().location;
    dispatch({
      type,
      payload,
      query: {
        ...query,
        category
      }
    });
  }
);
