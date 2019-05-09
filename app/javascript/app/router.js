import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';
import compact from 'lodash/compact';
import { handlePageTrack } from './analytics';
import { getNewMapRedirect } from './utils';

const history = createHistory();

export const ABOUT = 'location/ABOUT';
export const SGF = 'location/SGF';
export const MAP = 'location/MAP';
export const MAP_EMBED = 'location/MAP_EMBED';
export const DASHBOARDS = 'location/DASHBOARDS';
export const DASHBOARDS_EMBED = 'location/DASHBOARDS_EMBED';
export const TOPICS = 'location/TOPICS';
export const THANKYOU = 'location/THANKYOU';

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
  [ABOUT]: {
    controller: 'about',
    path: '/about',
    component: 'about',
    sections: [
      {
        label: 'GFW in Action',
        anchor: 'gfw-in-action',
        component: 'how'
      },
      {
        label: 'Impacts',
        anchor: 'impacts',
        component: 'impacts'
      },
      {
        label: 'History',
        anchor: 'history',
        component: 'history'
      },
      {
        label: 'Contact Us',
        anchor: 'contact',
        component: 'contact'
      },
      {
        label: 'Partnership',
        anchor: 'partnership',
        component: 'partners'
      }
    ]
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
    controller: 'map_v2',
    path: '/map/:type?/:adm0?/:adm1?/:adm2?',
    component: 'map',
    headerOptions: {
      isMap: true,
      fullScreen: true,
      showPanel: true,
      fixed: true,
      toggle: true
    }
  },
  [MAP_EMBED]: {
    controller: 'map_v2',
    path: '/embed/map/:type?/:adm0?/:adm1?/:adm2?',
    component: 'map',
    embed: true
  },
  [TOPICS]: {
    controller: 'topics',
    path: '/topics/:tab',
    component: 'topics',
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
    path: '/dashboards/:type?/:adm0?/:adm1?/:adm2?',
    component: 'dashboards'
  },
  [DASHBOARDS_EMBED]: {
    controller: 'dashboards',
    path: '/embed/dashboards/:type?/:adm0?/:adm1?/:adm2?',
    component: 'dashboards/embed',
    embed: true
  },
  [THANKYOU]: {
    path: '/thank-you',
    component: 'thankyou',
    controller: 'thankyou'
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: redirectThunk
  }
};

export default connectRoutes(history, routes, {
  querySerializer: {
    parse: decodeUrlForState,
    stringify: encodeStateForUrl
  },
  onAfterChange: routeChangeThunk
});
