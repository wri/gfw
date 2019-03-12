import { createThunkAction } from 'redux-tools';
import { setComponentStateToUrl } from 'utils/stateToUrl';

export const setDashboardsSettings = createThunkAction(
  'setDashboardsSettings',
  change => (dispatch, state) =>
    dispatch(
      setComponentStateToUrl({
        key: 'dashboards',
        change,
        state
      })
    )
);

export const handleCategoryChange = createThunkAction(
  'handleCategoryChange',
  category => (dispatch, getState) => {
    const { query, type, payload } = getState().location || {};
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
