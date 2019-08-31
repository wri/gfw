import { createAction, createThunkAction } from 'redux-tools';
import { track } from 'app/analytics';

import { setComponentStateToUrl } from 'utils/stateToUrl';
import { getNonGlobalDatasets } from 'services/forest-data';

// widgets
export const setWidgetsData = createAction('setWidgetsData');
export const setWidgetsLoading = createAction('setWidgetsLoading');

export const getWidgetsData = createThunkAction(
  'getWidgetsData',
  () => (dispatch, getState) => {
    const { widgets } = getState();
    if (widgets && !widgets.loading) {
      dispatch(setWidgetsLoading({ loading: true, error: false }));
      getNonGlobalDatasets()
        .then(response => {
          const { rows } = response.data;
          dispatch(
            setWidgetsData({
              nonGlobalDatasets: rows && rows[0]
            })
          );
        })
        .catch(error => {
          dispatch(setWidgetsLoading({ error: true, loading: false }));
          console.info(error);
        });
    }
  }
);

export const setWidgetSettings = createThunkAction(
  'setWidgetSettings',
  ({ change, widget }) => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'widget',
        subKey: widget,
        change,
        state
      })
    );
    track('changeWidgetSettings', {
      label: `${widget}`
    });
  }
);

export const setActiveWidget = createThunkAction(
  'setActiveWidget',
  widget => (dispatch, getState) => {
    const { query, type, payload } = getState().location;
    dispatch({
      type,
      payload,
      query: {
        ...query,
        widget,
        showMap: true
      }
    });
  }
);
