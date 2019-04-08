import { createStructuredSelector, createSelector } from 'reselect';

import initialState from './initial-state';

const getMapPromptsState = state =>
  state.location && state.location.query && state.location.query.mapPrompts;

export const getMapPromptsSettings = createSelector(
  [getMapPromptsState],
  urlState => ({
    ...initialState,
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

export const getMapPromptsProps = createStructuredSelector({
  open: getMapPromptsOpen,
  stepIndex: getMapPromptsStepIndex,
  stepsKey: getMapPromptsStepsKey
});
