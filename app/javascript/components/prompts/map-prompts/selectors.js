import { createStructuredSelector, createSelector } from 'reselect';
import flatMap from 'lodash/flatMap';
import uniq from 'lodash/uniq';

import { getMapZoom, getActiveDatasets } from 'components/map/selectors';
import { getShowRecentImagery } from 'layouts/map/selectors';

import { initialState } from './reducers';

const getMapPromptsState = state =>
  state.location && state.location.query && state.location.query.mapPrompts;
export const selectShowMapPrompts = state =>
  state.mapPrompts && state.mapPrompts.showPrompts;

export const getMapPromptsSettings = createSelector(
  [getMapPromptsState],
  urlState => ({
    ...initialState.settings,
    ...urlState
  })
);

export const getMapPromptsOpen = createSelector(
  getMapPromptsSettings,
  settings => settings.open
);

export const getMapPromptsStepIndex = createSelector(
  getMapPromptsSettings,
  settings => settings.stepIndex
);

export const getMapPromptsStepsKey = createSelector(
  getMapPromptsSettings,
  settings => settings.stepsKey
);

export const getDatasetCategories = createSelector(
  [getActiveDatasets],
  datasets => datasets && uniq(flatMap(datasets.map(d => d.tags)))
);

export const getDatasetIds = createSelector(
  [getActiveDatasets],
  datasets => datasets && datasets.map(d => d.id)
);

export const getMapPromptsProps = createStructuredSelector({
  open: getMapPromptsOpen,
  stepIndex: getMapPromptsStepIndex,
  stepsKey: getMapPromptsStepsKey,
  mapZoom: getMapZoom,
  recentActive: getShowRecentImagery,
  showPrompts: selectShowMapPrompts,
  activeCategories: getDatasetCategories,
  datasetIds: getDatasetIds
});
