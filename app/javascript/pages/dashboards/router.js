import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';

import { handlePageTrack } from 'utils/analytics';

const history = createHistory();

export const COUNTRY = 'location/COUNTRY';
export const EMBED = 'location/EMBED';

const routeChangeThunk = (dispatch, getState) => {
  // track page with GA
  handlePageTrack(getState().location);
};

export const routes = {
  [COUNTRY]: {
    path: '/dashboards/:type?/:country?/:region?/:subRegion?'
  },
  [EMBED]: {
    path: '/embed/dashboards/:type/:country?/:region?/:subRegion?'
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch =>
      dispatch(redirect({ type: COUNTRY, location: { type: 'global' } }))
  }
};

export default connectRoutes(history, routes, {
  querySerializer: {
    parse: decodeUrlForState,
    stringify: encodeStateForUrl
  },
  onAfterChange: routeChangeThunk
});
