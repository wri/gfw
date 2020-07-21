import { createThunkAction, createAction } from 'utils/redux';
import { track } from 'app/analytics';

export const setShowDashboardPrompts = createAction('setShowDashboardPrompts');
export const setShowPromptsViewed = createAction('setShowPromptsViewed');
export const setDashboardPrompts = createAction('setDashboardPrompts');

export const setDashboardPromptsSettings = createThunkAction(
  'setDashboardPromptsSettings',
  (change) => (dispatch, state) => {
    const { dashboardPrompts } = state() || {};
    const { promptsViewed, showPrompts } = dashboardPrompts || {};
    const { stepsKey, force, stepIndex } = change || {};

    if (
      force ||
      (showPrompts && (!promptsViewed || !promptsViewed.includes(stepsKey)))
    ) {
      dispatch(setDashboardPrompts(change));
      if (stepsKey) {
        track('userPrompt', {
          label: `${stepsKey}: ${stepIndex + 1}`,
        });
      }
    }

    if (stepsKey && showPrompts) {
      dispatch(setShowPromptsViewed(stepsKey));
    }
  }
);
