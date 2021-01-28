import { hasSeenSurvey, setSurveySeenCookie } from 'utils/cookies';

const isServer = typeof window !== 'undefined';
const isDebugMode = !isServer && process.env.NODE_ENV !== 'production';

// Hotjar events
export const TOGGLE_PLANET_BASEMAP = 'planet_toggle_on';

export const triggerEvent = (event, delay = 5) => {
  if (isDebugMode) {
    console.info(`hotjar trigger ${event} with delay ${delay}s`); // eslint-disable-line
  }
  if (typeof hj === 'function' && !hasSeenSurvey(event)) {
    setTimeout(() => {
      hj('trigger', event);
      setSurveySeenCookie(event);
      if (isDebugMode) {
        console.info(`Event ${event} triggered after ${delay}s`); // eslint-disable-line
      }
    }, delay * 1000);
  } else if (isDebugMode) {
    console.error('Hotjar not available'); // eslint-disable-line
  }
};
