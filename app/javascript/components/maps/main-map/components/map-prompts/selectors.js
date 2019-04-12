import { createStructuredSelector, createSelector } from 'reselect';

import { getMapZoom } from 'components/maps/map/selectors';
import { getActive } from 'components/maps/main-map/components/recent-imagery/recent-imagery-selectors';

import { initialState } from './reducers';

const getMapPromptsState = state =>
  state.location && state.location.query && state.location.query.mapPrompts;
const getLocation = state => state.location && state.location.payload;
const getPromptsData = state => state.mapPrompts && state.mapPrompts.data;

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

export const getShowMapPrompts = createSelector(
  getPromptsData,
  data => data && data.showPrompts
);

export const getMapPromptsProps = createStructuredSelector({
  open: getMapPromptsOpen,
  stepIndex: getMapPromptsStepIndex,
  stepsKey: getMapPromptsStepsKey,
  mapZoom: getMapZoom,
  location: getLocation,
  recentActive: getActive,
  showPrompts: getShowMapPrompts
});
