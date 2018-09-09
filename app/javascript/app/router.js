import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import { handlePageTrack } from 'utils/analytics';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';

const history = createHistory();

export const MAP = 'location/MAP';
export const DASHBOARDS = 'location/DASHBOARDS';
export const WIDGET_EMBED = 'location/WIDGET_EMBED';

const routeChangeThunk = (dispatch, getState) => {
  // track page with GA
  handlePageTrack(getState().location);
};

export const routes = {
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
