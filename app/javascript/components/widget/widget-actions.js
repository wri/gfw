import { createThunkAction } from 'utils/redux';
import upperFirst from 'lodash/upperFirst';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import { encodeStateForUrl, decodeUrlForState } from 'utils/stateToUrl';
import WIDGETS_CONFIG from './widget-config.json';

import * as treeLossActions from './widgets/widget-tree-loss/widget-tree-loss-actions';
import * as treeLossPlantationsActions from './widgets/widget-tree-loss-plantations/widget-tree-loss-plantations-actions';
import * as treeCoverActions from './widgets/widget-tree-cover/widget-tree-cover-actions';
import * as treeCoverPlantationsActions from './widgets/widget-tree-cover-plantations/widget-tree-cover-plantations-actions';
import * as intactTreeCoverActions from './widgets/widget-intact-tree-cover/widget-intact-tree-cover-actions';
import * as primaryTreeCoverActions from './widgets/widget-primary-tree-cover/widget-primary-tree-cover-actions';
import * as treeLocatedActions from './widgets/widget-tree-located/widget-tree-located-actions';
import * as gainLocatedActions from './widgets/widget-gain-located/widget-gain-located-actions';
import * as lossLocatedActions from './widgets/widget-loss-located/widget-loss-located-actions';
import * as lossRankedActions from './widgets/widget-loss-ranked/widget-loss-ranked-actions';
import * as treeCoverRankedActions from './widgets/widget-tree-cover-ranked/widget-tree-cover-ranked-actions';
import * as treeGainActions from './widgets/widget-tree-gain/widget-tree-gain-actions';
import * as FAOReforestationActions from './widgets/widget-fao-reforestation/widget-fao-reforestation-actions';
import * as FAODeforestationActions from './widgets/widget-fao-deforestation/widget-fao-deforestation-actions';
import * as FAOCoverActions from './widgets/widget-fao-cover/widget-fao-cover-actions';
import * as gladAlertsActions from './widgets/widget-glad-alerts/widget-glad-alerts-actions';
import * as gladBiodiversityActions from './widgets/widget-glad-biodiversity/widget-glad-biodiversity-actions';
import * as gladRankedActions from './widgets/widget-glad-ranked/widget-glad-ranked-actions';
import * as rankedPlantationsActions from './widgets/widget-ranked-plantations/widget-ranked-plantations-actions';
import * as emissionsActions from './widgets/widget-emissions/widget-emissions-actions';
import * as emissionsDeforestationActions from './widgets/widget-emissions-deforestation/widget-emissions-deforestation-actions';
import * as firesActions from './widgets/widget-fires/widget-fires-actions';
import * as forestryEmploymentActions from './widgets/widget-forestry-employment/widget-forestry-employment-actions';
import * as economicImpactActions from './widgets/widget-economic-impact/widget-economic-impact-actions';

const widgetActions = {
  ...treeLossActions.default,
  ...treeLossPlantationsActions.default,
  ...treeCoverActions.default,
  ...treeCoverPlantationsActions.default,
  ...intactTreeCoverActions.default,
  ...primaryTreeCoverActions.default,
  ...treeLocatedActions.default,
  ...gainLocatedActions.default,
  ...lossLocatedActions.default,
  ...lossRankedActions.default,
  ...treeCoverRankedActions.default,
  ...treeGainActions.default,
  ...FAOReforestationActions.default,
  ...FAODeforestationActions.default,
  ...FAOCoverActions.default,
  ...gladAlertsActions.default,
  ...gladBiodiversityActions.default,
  ...gladRankedActions.default,
  ...rankedPlantationsActions.default,
  ...emissionsActions.default,
  ...emissionsDeforestationActions.default,
  ...firesActions.default,
  ...forestryEmploymentActions.default,
  ...economicImpactActions.default
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
      if (Object.keys(WIDGETS_CONFIG).indexOf(widgetKey) > -1) {
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
