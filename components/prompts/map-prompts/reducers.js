import { trackEvent } from 'utils/analytics';
import * as actions from './actions';

const isServer = typeof window === 'undefined';

const showMapPrompts =
  !isServer && JSON.parse(localStorage.getItem('showPrompts'));
const mapPromptsViewed =
  !isServer && JSON.parse(localStorage.getItem('mapPromptsViewed'));

export const initialState = {
  showPrompts: showMapPrompts === null || showMapPrompts,
  promptsViewed: mapPromptsViewed || [],
  settings: {
    open: false,
    stepIndex: 0,
    stepsKey: '',
  },
};

const setShowMapPrompts = (state, { payload }) => {
  if (!isServer) {
    localStorage.setItem('showPrompts', payload);
  }
  trackEvent({
    category: 'User prompts',
    action: 'User prompt is hidden/shown',
    label: payload ? 'User enables prompts' : 'User hides prompts'
  })

  return {
    ...state,
    showPrompts: payload,
  };
};

const setShowPromptsViewed = (state, { payload }) => {
  const { promptsViewed } = state;
  const newPromptsViewed =
    promptsViewed && promptsViewed.length && promptsViewed.includes(payload)
      ? promptsViewed
      : promptsViewed.concat([payload]);
  if (!isServer) {
    localStorage.setItem('mapPromptsViewed', JSON.stringify(newPromptsViewed));
  }

  return {
    ...state,
    promptsViewed: newPromptsViewed,
  };
};

const setMapPrompts = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload,
  },
});

export default {
  [actions.setShowMapPrompts]: setShowMapPrompts,
  [actions.setMapPrompts]: setMapPrompts,
  [actions.setShowPromptsViewed]: setShowPromptsViewed,
};
