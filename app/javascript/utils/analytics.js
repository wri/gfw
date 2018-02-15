import ReactGA from 'react-ga';
import CUSTOM_GA_EVENTS from 'pages/country/data/analytics.json';

const { ANALYTICS_PROPERTY_ID } = process.env;
let gaInitialized = false;

const initGA = () => {
  if (ANALYTICS_PROPERTY_ID) {
    if (!gaInitialized) {
      ReactGA.initialize(ANALYTICS_PROPERTY_ID);
      gaInitialized = true;
    }
  }
};

export const handlePageTrack = location => {
  initGA();
  if (gaInitialized) {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(window.location.href);
  }
};

export const handleActionTrack = () => nextDispatch => action => {
  initGA();
  if (gaInitialized) {
    const GAPayload = CUSTOM_GA_EVENTS[action.type];
    if (GAPayload) {
      const GAData = {
        ...GAPayload,
        ...(!!GAPayload.sendPayload && { ...action.payload })
      };
      ReactGA.event(GAData);
    }
  }
  nextDispatch(action);
};
