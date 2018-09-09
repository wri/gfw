import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import { handlePageTrack } from 'utils/analytics';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';

import History from 'pages/about/section-history';
import Impacts from 'pages/about/section-impacts';
import Partners from 'pages/about/section-partners';
import How from 'pages/about/section-how';
import Contact from 'pages/about/section-contact';

import Projects from 'pages/sgf/section-projects';
import About from 'pages/sgf/section-about';
import Apply from 'pages/sgf/section-apply';

const history = createHistory();

export const ABOUT = 'location/ABOUT';
export const SGF = 'location/SGF';
export const MAP = 'location/MAP';
export const DASHBOARDS = 'location/DASHBOARDS';
export const WIDGET_EMBED = 'location/WIDGET_EMBED';

const routeChangeThunk = (dispatch, getState) => {
  // track page with GA
  handlePageTrack(getState().location);
};

export const routes = {
  [ABOUT]: {
    path: '/about',
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
  [SGF]: {
    path: '/small-grants-fund/:tab?',
    component: 'pages/sgf',
    label: 'Projects',
    submenu: true,
    sections: {
      projects: {
        label: 'Projects',
        submenu: true,
        component: Projects,
        path: '/small-grants-fund'
      },
      about: {
        label: 'About',
        submenu: true,
        component: About,
        path: '/small-grants-fund/about'
      },
      apply: {
        label: 'Apply',
        submenu: true,
        component: Apply,
        path: '/small-grants-fund/apply'
      }
    }
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
