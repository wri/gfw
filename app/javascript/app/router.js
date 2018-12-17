import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import { handlePageTrack } from 'utils/analytics';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';
import compact from 'lodash/compact';
import { getNewMapRedirect } from './utils';

const history = createHistory();

export const ABOUT = 'location/ABOUT';
export const SGF = 'location/SGF';
export const MAP = 'location/MAP';
export const MAP_EMBED = 'location/MAP_EMBED';
export const DASHBOARDS = 'location/DASHBOARDS';
export const DASHBOARDS_EMBED = 'location/DASHBOARDS_EMBED';

const routeChangeThunk = (dispatch, getState) => {
  const currentLocation = getState().location.pathname;
  const prevLocation = getState().location.prev.pathname;
  if (currentLocation !== prevLocation) {
    handlePageTrack(getState().location);
  }
};

const redirectThunk = (dispatch, getState) => {
  const { location } = getState();
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
    dispatch(redirect({ type: MAP }));
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
    controller: 'small_grants_fund',
    path: '/small-grants-fund/:tab?',
    component: 'sgf',
    sections: {
      projects: {
        label: 'Projects',
        submenu: true,
        component: 'projects',
        path: '/small-grants-fund'
      },
      about: {
        label: 'About',
        submenu: true,
        component: 'about',
        path: '/small-grants-fund/about'
      },
      apply: {
        label: 'Apply',
        submenu: true,
        component: 'apply',
        path: '/small-grants-fund/apply'
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
  [DASHBOARDS]: {
    controller: 'dashboards',
    path: '/dashboards/:type?/:adm0?/:adm1?/:adm2?',
    component: 'dashboards',
    headerOptions: true
  },
  [DASHBOARDS_EMBED]: {
    controller: 'dashboards',
    path: '/embed/dashboards/:type?/:adm0?/:adm1?/:adm2?',
    component: 'dashboards/embed',
    embed: true
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
