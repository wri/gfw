import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';
import compact from 'lodash/compact';
import { handlePageTrack } from './analytics';
import { getNewMapRedirect } from './utils';

const history = createHistory();

export const HOME = 'location/HOME';
export const ABOUT = 'location/ABOUT';
export const SGF = 'location/SGF';
export const MAP = 'location/MAP';
export const MAP_EMBED = 'location/MAP_EMBED';
export const DASHBOARDS = 'location/DASHBOARDS';
export const DASHBOARDS_EMBED = 'location/DASHBOARDS_EMBED';
export const MYGFW = 'location/MYGFW';
export const TOPICS = 'location/TOPICS';
export const THANKYOU = 'location/THANKYOU';
export const STORIES = 'location/STORIES';
export const TERMS = 'location/TERMS';
export const PRIVACY = 'location/PRIVACY';
export const BROWSER_SUPPORT = 'location/BROWSER_SUPPORT';
export const UNACCEPTABLE = 'location/UNACCEPTABLE';
export const INTERNAL_ERROR = 'location/INTERNAL_ERROR';
export const SEARCH = 'location/SEARCH';

const routeChangeThunk = (dispatch, getState) => {
  const { location } = getState() || {};
  const currentLocation = location.pathname;
  const prevLocation = location && location.prev.pathname;
  if (prevLocation && currentLocation !== prevLocation) {
    handlePageTrack();
  }
};

const redirectThunk = (dispatch, getState) => {
  const { location } = getState() || {};

  if (location.pathname === '/dashboards') {
    dispatch(redirect({ type: DASHBOARDS, payload: { type: 'global' } }));
    return;
  }

  if (location.pathname === '/topics') {
    dispatch(redirect({ type: TOPICS, payload: { tab: 'biodiversity' } }));
    return;
  }

  const routeSlugs = location.pathname && location.pathname.split('/');
  const isOldMap = routeSlugs.includes('map');
  if (isOldMap) {
    dispatch(
      redirect(
        getNewMapRedirect({
          slugs: compact(routeSlugs),
          query: location.query
        })
      )
    );
  } else {
    const splitPath = location.pathname && location.pathname.split('/');
    const newPath =
      (splitPath && splitPath.length > 1 && splitPath[1]) || 'map';
    dispatch(redirect({ type: `location/${newPath.toUpperCase()}` }));
  }
};

export const routes = {
  [HOME]: {
    controller: 'home',
    path: '/',
    component: 'home'
  },
  [ABOUT]: {
    controller: 'about',
    path: '/about',
    component: 'about',
    sections: {
      how: {
        label: 'GFW in Action',
        anchor: 'gfw-in-action',
        component: 'how'
      },
      impacts: {
        label: 'Impacts',
        anchor: 'impacts',
        component: 'impacts'
      },
      history: {
        label: 'History',
        anchor: 'history',
        component: 'history'
      },
      contact: {
        label: 'Contact Us',
        anchor: 'contact',
        component: 'contact'
      },
      partners: {
        label: 'Partnership',
        anchor: 'partnership',
        component: 'partners'
      }
    }
  },
  [SGF]: {
    controller: 'grants_and_fellowships',
    path: '/grants-and-fellowships/:tab?',
    component: 'sgf',
    sections: {
      projects: {
        label: 'Projects',
        submenu: true,
        component: 'projects',
        path: '/grants-and-fellowships'
      },
      about: {
        label: 'About',
        submenu: true,
        component: 'about',
        path: '/grants-and-fellowships/about'
      },
      apply: {
        label: 'Apply',
        submenu: true,
        component: 'apply',
        path: '/grants-and-fellowships/apply'
      }
    }
  },
  [MAP]: {
    controller: 'map',
    path: '/map/:type?/:adm0?/:adm1?/:adm2?',
    component: 'map',
    fullScreen: true,
    hideFooter: true
  },
  [MAP_EMBED]: {
    controller: 'map',
    path: '/embed/map/:type?/:adm0?/:adm1?/:adm2?',
    component: 'map',
    embed: true,
    fullScreen: true
  },
  [TOPICS]: {
    controller: 'topics',
    path: '/topics/:tab',
    component: 'topics',
    hideFooter: true,
    sections: {
      biodiversity: {
        label: 'Biodiversity',
        submenu: true,
        component: 'biodiversity',
        path: '/topics/biodiversity'
      },
      climate: {
        label: 'Climate',
        submenu: true,
        component: 'climate',
        path: '/topics/climate'
      },
      commodities: {
        label: 'Commodities',
        submenu: true,
        component: 'commodities',
        path: '/topics/commodities'
      },
      water: {
        label: 'Water',
        submenu: true,
        component: 'water',
        path: '/topics/water'
      }
    }
  },
  [DASHBOARDS]: {
    controller: 'dashboards',
    path: '/dashboards/:type/:adm0?/:adm1?/:adm2?',
    component: 'dashboards'
  },
  [DASHBOARDS_EMBED]: {
    controller: 'dashboards',
    path: '/embed/widget/:widgetSlug/:type/:adm0?/:adm1?/:adm2?',
    component: 'dashboards/components/embed',
    embed: true
  },
  [MYGFW]: {
    path: '/my-gfw',
    component: 'mygfw',
    controller: 'mygfw'
  },
  [THANKYOU]: {
    path: '/thank-you',
    component: 'thankyou',
    controller: 'thankyou'
  },
  [STORIES]: {
    path: '/stories',
    component: 'stories',
    controller: 'stories'
  },
  [TERMS]: {
    path: '/terms',
    component: 'terms',
    controller: 'terms'
  },
  [PRIVACY]: {
    path: '/privacy-policy',
    component: 'privacy',
    controller: 'privacy'
  },
  [BROWSER_SUPPORT]: {
    path: '/browser-support',
    component: 'browser-support',
    controller: 'browser_support'
  },
  [UNACCEPTABLE]: {
    path: '/422',
    controller: 'unacceptable',
    component: 'error'
  },
  [INTERNAL_ERROR]: {
    path: '/500',
    controller: 'internal_error',
    component: 'error'
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: redirectThunk,
    controller: 'not_found',
    component: 'error'
  },
  [SEARCH]: {
    path: '/search/:query?/:page?',
    component: 'search',
    controller: 'search'
  }
};

export default connectRoutes(history, routes, {
  querySerializer: {
    parse: decodeUrlForState,
    stringify: encodeStateForUrl
  },
  onAfterChange: routeChangeThunk
});
