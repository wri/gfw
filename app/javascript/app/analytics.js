import ReactGA from 'react-ga';

import { decodeUrlForState } from 'utils/stateToUrl';
import mapEvents from 'analytics/map';
import sharedEvents from 'analytics/shared';
import dashboardsEvents from 'analytics/dashboards';
import topicsEvents from 'analytics/topics';

const { ANALYTICS_PROPERTY_ID } = process.env;
let gaInitialized = false;

export const initGA = () => {
  if (ANALYTICS_PROPERTY_ID) {
    if (!gaInitialized) {
      ReactGA.initialize(ANALYTICS_PROPERTY_ID, {
        debug: false
      });
      gaInitialized = true;
    }
  }
};

const events = {
  ...mapEvents,
  ...dashboardsEvents,
  ...sharedEvents,
  ...topicsEvents
};

export const handlePageTrack = () => {
  initGA();
  if (gaInitialized) {
    const url = `${window.location.pathname}${window.location.search}`;
    ReactGA.set({ page: url });
    ReactGA.pageview(url);
  }
};

export const handleMapLatLonTrack = location => {
  if (gaInitialized) {
    const { query } = location || {};
    const { map } = query || {};
    const position =
      map && `/location/${map.center.lat}/${map.center.lng}/${map.zoom}`;
    if (position) {
      ReactGA.pageview(
        `${position}${window.location.pathname}?${JSON.stringify(
          decodeUrlForState(window.location.search)
        )}`
      );
    }
  }
};

export const track = (key, data) =>
  ReactGA && events[key] && ReactGA.event({ ...events[key], ...data });
