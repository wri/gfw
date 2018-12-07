import { createThunkAction } from 'vizzuality-redux-tools';

export const handleCategoryChange = createThunkAction(
  'handleCategoryChange',
  category => (dispatch, getState) => {
    const { query, type, payload } = getState().location;
    dispatch({
      type,
      payload,
      query: {
        ...query,
        category,
        widget: undefined
      }
    });
  }
);
