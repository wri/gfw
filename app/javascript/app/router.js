import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import { handlePageTrack } from 'utils/analytics';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';

import History from 'pages/about/section-history';
import Impacts from 'pages/about/section-impacts';
import Partners from 'pages/about/section-partners';
import How from 'pages/about/section-how';
import Contact from 'pages/about/section-contact';

import { fetchImpactProjects } from 'pages/about/section-impacts/section-impacts-actions';
import { fetchProjects } from 'pages/about/section-projects/section-projects-actions';

const history = createHistory();

export const ABOUT = 'location/ABOUT';
export const MAP = 'location/MAP';
export const DASHBOARDS = 'location/DASHBOARDS';
export const WIDGET_EMBED = 'location/WIDGET_EMBED';

const routeChangeThunk = (dispatch, getState) => {
  // track page with GA
  handlePageTrack(getState().location);
};

const fetchData = dispatch => {
  dispatch(fetchProjects());
  dispatch(fetchImpactProjects());
};

export const routes = {
  [ABOUT]: {
    path: '/about',
    thunk: fetchData,
    component: 'pages/about',
    sections: [
      {
        label: 'GFW in Action',
        anchor: 'gfw-in-action',
        component: How
      },
      {
        label: 'Impacts',
        anchor: 'impacts',
        component: Impacts
      },
      {
        label: 'History',
        anchor: 'history',
        component: History
      },
      {
        label: 'Contact Us',
        anchor: 'contact',
        component: Contact
      },
      {
        label: 'Partnership',
        anchor: 'partnership',
        component: Partners
      }
    ]
  },
  [MAP]: {
    path: '/v2/map/:tab?/:country?/:region?/:subRegion?',
    component: 'pages/map-v2',
    headerOptions: {
      fullScreen: true,
      showPanel: true,
      fixed: true,
      toggle: true
    }
  },
  [DASHBOARDS]: {
    path: '/dashboards/:type?/:country?/:region?/:subRegion?',
    component: 'pages/dashboards'
  },
  [WIDGET_EMBED]: {
    path: '/embed/dashboards/:type?/:country?/:region?/:subRegion?',
    component: 'pages/dashboards/embed'
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch => dispatch(redirect({ type: MAP }))
  }
};

export default connectRoutes(history, routes, {
  querySerializer: {
    parse: decodeUrlForState,
    stringify: encodeStateForUrl
  },
  onAfterChange: routeChangeThunk
});
