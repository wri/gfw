import { createThunkAction } from 'utils/redux';
import * as treeLossActions from 'pages/country/widget/widgets/widget-tree-loss/widget-tree-loss-actions';
import * as treeCoverActions from 'pages/country/widget/widgets/widget-tree-cover/widget-tree-cover-actions';
import upperFirst from 'lodash/upperFirst';
import { encodeStateForUrl, decodeUrlForState } from 'utils/stateToUrl';

const widgetActions = {
  ...treeLossActions.default,
  ...treeCoverActions.default
};

export const setWidgetSettingsUrl = createThunkAction(
  'setWidgetSettingsUrl',
  ({ value, widget }) => (dispatch, state) => {
    const { location } = state();
    let params = value;
    if (location.query && location.query[widget]) {
      params = {
        ...decodeUrlForState(location.query[widget]),
        ...value
      };
    }
    dispatch({
      type: 'location/COUNTRY',
      payload: location.payload,
      query: { [widget]: encodeStateForUrl(params) }
    });
  }
);

export const setWidgetSettingsStore = createThunkAction(
  'setWidgetSettingsStore',
  query => dispatch => {
    Object.keys(query).forEach(widgetKey => {
      const actionFunc = widgetActions[`set${upperFirst(widgetKey)}Settings`];
      if (actionFunc) {
        dispatch(actionFunc(decodeUrlForState(query[widgetKey])));
      }
    });
  }
);

export default {
  setWidgetSettingsUrl,
  setWidgetSettingsStore
};
