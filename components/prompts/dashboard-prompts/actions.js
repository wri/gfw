import { createThunkAction, createAction } from 'redux/actions';
import { trackEvent } from 'utils/analytics';

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
        trackEvent({
          category: 'User prompts',
          action: 'User prompt is changed',
          label: `${stepsKey}: ${stepIndex + 1}`,
        })
      }
    }

    if (stepsKey && showPrompts) {
      dispatch(setShowPromptsViewed(stepsKey));
    }
  }
);
