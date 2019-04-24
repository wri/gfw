import { createAction, createThunkAction } from 'redux-tools';
import { track } from 'app/analytics';

import { setComponentStateToUrl } from 'utils/stateToUrl';
import { getNonGlobalDatasets } from 'services/forest-data';

// widgets
export const setWidgetsData = createAction('setWidgetsData');
export const setWidgetsSettings = createAction('setWidgetsSettings');
export const setWidgetsLoading = createAction('setWidgetsLoading');

// widget
export const setWidgetData = createAction('setWidgetData');
export const setWidgetLoading = createAction('setWidgetLoading');

export const getWidgetsData = createThunkAction(
  'getWidgetsData',
  () => (dispatch, getState) => {
    const { widgets } = getState();
    if (widgets && !widgets.loading) {
      dispatch(setWidgetsLoading({ loading: true, error: false }));
      getNonGlobalDatasets()
        .then(response => {
          const { data } = response.data;
          const nonGlobalDatasets = {};
          data.forEach(el => {
            const items = Object.entries(el);
            items.forEach(item => {
              const key = item[0];
              const value = item[1];
              if (key !== 'iso' && value > 0) {
                if (!nonGlobalDatasets[key]) nonGlobalDatasets[key] = 0;
                nonGlobalDatasets[key] += 1;
              }
            });
          });
          dispatch(
            setWidgetsData({
              nonGlobalDatasets
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

export const getWidgetData = createThunkAction(
  'getWidgetData',
  ({ getData, widget, params }) => (dispatch, state) => {
    const widgetState = state().widgets.widgets[widget];
    if (!widgetState || (widgetState && !widgetState.loading)) {
      dispatch(setWidgetLoading({ widget, loading: true, error: false }));
      getData({ params })
        .then(data => {
          dispatch(setWidgetData({ widget, data }));
          if (data.settings) {
            dispatch(setWidgetSettings({ widget, value: data.settings }));
          }
        })
        .catch(error => {
          dispatch(setWidgetLoading({ widget, error: true, loading: false }));
          console.info(error);
        });
    }
  }
);

export const setWidgetSettings = createThunkAction(
  'setWidgetSettings',
  ({ value, widget }) => (dispatch, state) => {
    dispatch(
      setComponentStateToUrl({
        key: 'widget',
        subKey: widget,
        change: value,
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
        widget
      }
    });
  }
);
