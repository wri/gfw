import { logEvent } from 'app/analytics';
import * as actions from './actions';

const showDashboardPrompts = JSON.parse(localStorage.getItem('showPrompts'));
const dashboardPromptsViewed = JSON.parse(
  localStorage.getItem('dashboardPromptsViewed')
);

export const initialState = {
  showPrompts: showDashboardPrompts === null || showDashboardPrompts,
  promptsViewed: dashboardPromptsViewed || [],
  settings: {
    open: false,
    stepIndex: 0,
    stepsKey: ''
  }
};

const setShowDashboardPrompts = (state, { payload }) => {
  localStorage.setItem('showPrompts', payload);
  logEvent('userPromptShowHide', {
    label: payload ? 'User enables prompts' : 'User hides prompts'
  });

  return {
    ...state,
    showPrompts: payload
  };
};

const setShowPromptsViewed = (state, { payload }) => {
  const { promptsViewed } = state;
  const newPromptsViewed =
    promptsViewed && promptsViewed.length && promptsViewed.includes(payload)
      ? promptsViewed
      : promptsViewed.concat([payload]);
  localStorage.setItem(
    'dashboardPromptsViewed',
    JSON.stringify(newPromptsViewed)
  );

  return {
    ...state,
    promptsViewed: newPromptsViewed
  };
};

export default {
  [actions.setShowDashboardPrompts]: setShowDashboardPrompts,
  [actions.setShowPromptsViewed]: setShowPromptsViewed
};
