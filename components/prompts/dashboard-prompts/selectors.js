import { createStructuredSelector, createSelector } from 'reselect';

import { getShowRecentImagery } from 'layouts/map/selectors';

const getDashboardPromptsSettings = (state) =>
  state.dashboardPrompts?.settings || {};
export const selectShowDashboardPrompts = (state) =>
  state.dashboardPrompts && state.dashboardPrompts.showPrompts;

export const getDashboardPromptsOpen = createSelector(
  getDashboardPromptsSettings,
  (settings) => settings.open
);

export const getDashboardPromptsStepIndex = createSelector(
  getDashboardPromptsSettings,
  (settings) => settings.stepIndex
);

export const getDashboardPromptsStepsKey = createSelector(
  getDashboardPromptsSettings,
  (settings) => settings.stepsKey
);

export const getDashboardPromptsProps = createStructuredSelector({
  open: getDashboardPromptsOpen,
  stepIndex: getDashboardPromptsStepIndex,
  stepsKey: getDashboardPromptsStepsKey,
  recentActive: getShowRecentImagery,
  showPrompts: selectShowDashboardPrompts,
});
