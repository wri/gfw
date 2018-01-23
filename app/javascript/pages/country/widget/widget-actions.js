import { createThunkAction } from 'utils/redux';
import upperFirst from 'lodash/upperFirst';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { encodeStateForUrl, decodeUrlForState } from 'utils/stateToUrl';

import * as treeLossActions from 'pages/country/widget/widgets/widget-tree-loss/widget-tree-loss-actions';
import * as treeLossPlantationsActions from 'pages/country/widget/widgets/widget-tree-loss-plantations/widget-tree-loss-plantations-actions';
import * as treeCoverActions from 'pages/country/widget/widgets/widget-tree-cover/widget-tree-cover-actions';
import * as treeCoverPlantationsActions from 'pages/country/widget/widgets/widget-tree-cover-plantations/widget-tree-cover-plantations-actions';
import * as intactTreeCoverActions from 'pages/country/widget/widgets/widget-intact-tree-cover/widget-intact-tree-cover-actions';
import * as primaryTreeCoverActions from 'pages/country/widget/widgets/widget-primary-tree-cover/widget-primary-tree-cover-actions';
import * as treeLocatedActions from 'pages/country/widget/widgets/widget-tree-located/widget-tree-located-actions';
import * as relativeTreeCoverActions from 'pages/country/widget/widgets/widget-relative-tree-cover/widget-relative-tree-cover-actions';
import * as treeGainActions from 'pages/country/widget/widgets/widget-tree-gain/widget-tree-gain-actions';
import * as FAOReforestationActions from 'pages/country/widget/widgets/widget-fao-reforestation/widget-fao-reforestation-actions';
import * as FAOCoverActions from 'pages/country/widget/widgets/widget-fao-cover/widget-fao-cover-actions';
import * as rankedPlantationsActions from 'pages/country/widget/widgets/widget-ranked-plantations/widget-ranked-plantations-actions';

const widgetActions = {
  ...treeLossActions.default,
  ...treeLossPlantationsActions.default,
  ...treeCoverActions.default,
  ...treeCoverPlantationsActions.default,
  ...intactTreeCoverActions.default,
  ...primaryTreeCoverActions.default,
  ...treeLocatedActions.default,
  ...relativeTreeCoverActions.default,
  ...treeGainActions.default,
  ...FAOReforestationActions.default,
  ...FAOCoverActions.default,
  ...rankedPlantationsActions.default
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
      if (widgetKey !== 'category') {
        const widgetConfig = decodeUrlForState(query[widgetKey]);
        const { settings } = getState()[`widget${upperFirst(widgetKey)}`];
        // Check if the state needs and update checking the values of the new config
        // with the existing in the url to avoid dispatch actions without changes
        if (!isObjectContained(widgetConfig, settings)) {
          const actionFunc =
            widgetActions[`set${upperFirst(widgetKey)}Settings`];
          if (actionFunc) {
            dispatch(actionFunc(widgetConfig));
          }
        }
      }
    });
  }
);

export default {
  setWidgetSettingsUrl,
  setWidgetSettingsStore
};
