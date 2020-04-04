import ReactGA from 'react-ga';

import mapEvents from 'analytics/map';
import sharedEvents from 'analytics/shared';
import dashboardsEvents from 'analytics/dashboards';
import topicsEvents from 'analytics/topics';

const { ANALYTICS_PROPERTY_ID } = process.env;

const events = {
  ...mapEvents,
  ...dashboardsEvents,
  ...sharedEvents,
  ...topicsEvents
};

export const initGA = () => {
  ReactGA.initialize(ANALYTICS_PROPERTY_ID);
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export const logEvent = (eventKey = '', data) => {
  if (eventKey) {
    ReactGA.event({ ...events[eventKey], ...data });
  }
};

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};

export const logMapLatLonTrack = location => {
  if (location) {
    const { query } = location || {};
    const { map } = query || {};
    const position =
      map && `/location/${map.center.lat}/${map.center.lng}/${map.zoom}`;
    if (position) {
      ReactGA.pageview(`${position}${window.location.pathname}}`);
    }
  }
};
