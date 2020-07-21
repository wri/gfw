import ReactGA from 'react-ga';

import { decodeUrlForState } from 'utils/stateToUrl';
import mapEvents from 'analytics/map';
import sharedEvents from 'analytics/shared';
import dashboardsEvents from 'analytics/dashboards';
import topicsEvents from 'analytics/topics';

const { ANALYTICS_PROPERTY_ID } = process.env;

export const initGA = () => {
  ReactGA.initialize(ANALYTICS_PROPERTY_ID);
};

const events = {
  ...mapEvents,
  ...dashboardsEvents,
  ...sharedEvents,
  ...topicsEvents
};

export const handlePageTrack = () => {
  const url = `${window.location.pathname}${window.location.search}`;
  ReactGA.set({ page: url });
  ReactGA.pageview(url);
};

export const handleMapLatLonTrack = location => {
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
};

export const track = (key, data) => events[key] && ReactGA.event({ ...events[key], ...data });