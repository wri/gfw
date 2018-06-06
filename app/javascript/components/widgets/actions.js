import { createAction } from 'redux-actions';
import { createThunkAction } from 'utils/redux';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { encodeStateForUrl, decodeUrlForState } from 'utils/stateToUrl';
import { COUNTRY, EMBED } from 'pages/dashboards/router';
import * as WIDGETS from './manifest';

export const setWidgetSettings = createAction('setWidgetSettings');
export const setWidgetLoading = createAction('setWidgetLoading');
export const setWidgetData = createAction('setWidgetData');
export const settingsItemSelected = createAction('settingsItemSelected');

export const getWidgetData = createThunkAction(
  'getWidgetData',
  ({ getData, widget, params }) => (dispatch, state) => {
    if (!state().widgets[widget].loading) {
      dispatch(setWidgetLoading(widget));
      getData({ params, dispatch, setWidgetData, widget, state });
    }
  }
);

export const setWidgetSettingsUrl = createThunkAction(
  'setWidgetSettingsUrl',
  ({ value, widget }) => (dispatch, state) => {
    dispatch(
      settingsItemSelected({
        value,
        widget
      })
    );
    const { location } = state();
    let params = value;
    if (location.query && location.query[widget]) {
      params = {
        ...decodeUrlForState(location.query[widget]),
        ...value
      };
    }
    dispatch({
      type: location.type === 'location/EMBED' ? EMBED : COUNTRY,
      payload: location.payload,
      query: {
        ...location.query,
        [widget]: encodeStateForUrl(params)
      }
    });
  }
);

function isObjectContained(contained, container) {
  return isEqual(pick(container, Object.keys(contained)), contained);
}

export const setWidgetSettingsStore = createThunkAction(
  'setWidgetSettingsStore',
  query => (dispatch, getState) => {
    Object.keys(query).forEach(widgetKey => {
      if (Object.keys(WIDGETS).indexOf(widgetKey) > -1) {
        const widgetConfig = decodeUrlForState(query[widgetKey]);
        const { settings } = getState().widgets[widgetKey];
        // Check if the state needs and update checking the values of the new config
        // with the existing in the url to avoid dispatch actions without changes
        if (!isObjectContained(widgetConfig, settings)) {
          dispatch(
            setWidgetSettings({ widget: widgetKey, settings: widgetConfig })
          );
        }
      }
    });
  }
);

export default {
  setWidgetSettingsUrl,
  setWidgetSettingsStore,
  settingsItemSelected,
  setWidgetData,
  getWidgetData,
  setWidgetLoading,
  setWidgetSettings
};
