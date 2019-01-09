import ReactGA from 'react-ga';

import mapEvents from 'analytics/map';
import sharedEvents from 'analytics/shared';
import dashboardsEvents from 'analytics/dashboards';

const { ANALYTICS_PROPERTY_ID } = process.env;
let gaInitialized = false;

export const initGA = () => {
  if (ANALYTICS_PROPERTY_ID) {
    if (!gaInitialized) {
      ReactGA.initialize(ANALYTICS_PROPERTY_ID);
      gaInitialized = true;
    }
  }
};

const events = {
  ...mapEvents,
  ...dashboardsEvents,
  ...sharedEvents
};

export const handlePageTrack = location => {
  initGA();
  if (gaInitialized) {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(window.location.href);
  }
};

export const track = (key, data) =>
  ReactGA && events[key] && ReactGA.event({ ...events[key], ...data });
