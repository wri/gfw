import { createStructuredSelector, createSelector } from 'reselect';

import { getShowRecentImagery } from 'pages/map/selectors';

import { initialState } from './reducers';

const getDashboardPromptsState = state =>
  state.location &&
  state.location.query &&
  state.location.query.dashboardPrompts;
export const selectShowDashboardPrompts = state =>
  state.dashboardPrompts && state.dashboardPrompts.showPrompts;

export const getDashboardPromptsSettings = createSelector(
  [getDashboardPromptsState],
  urlState => ({
    ...initialState.settings,
    ...urlState
  })
);

export const getDashboardPromptsOpen = createSelector(
  getDashboardPromptsSettings,
  settings => settings.open
);

export const getDashboardPromptsStepIndex = createSelector(
  getDashboardPromptsSettings,
  settings => settings.stepIndex
);

export const getDashboardPromptsStepsKey = createSelector(
  getDashboardPromptsSettings,
  settings => settings.stepsKey
);

export const getDashboardPromptsProps = createStructuredSelector({
  open: getDashboardPromptsOpen,
  stepIndex: getDashboardPromptsStepIndex,
  stepsKey: getDashboardPromptsStepsKey,
  recentActive: getShowRecentImagery,
  showPrompts: selectShowDashboardPrompts
});
