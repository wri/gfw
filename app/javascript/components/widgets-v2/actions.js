import { createAction, createThunkAction } from 'redux-tools';
import groupBy from 'lodash/groupBy';

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
    if (!getState().widgetsV2.loading) {
      dispatch(setWidgetsLoading({ loading: true, error: false }));
      getNonGlobalDatasets()
        .then(response => {
          const { data } = response.data;
          const groupedData = groupBy(data, 'polyname');
          const nonGlobalDatasets = {};
          Object.keys(groupedData).forEach(d => {
            nonGlobalDatasets[d] = groupedData[d].length;
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
    const widgetState = state().widgetsV2.widgets[widget];
    if (!widgetState || (widgetState && !widgetState.loading)) {
      dispatch(setWidgetLoading({ widget, loading: true, error: false }));
      getData({ params })
        .then(data => {
          dispatch(setWidgetData({ widget, data }));
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
  }
);
