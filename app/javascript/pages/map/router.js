import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import { handlePageTrack } from 'utils/analytics';

const history = createHistory();

export const MAP = 'location/MAP';
export const COUNTRY = 'location/COUNTRY';

const routeChangeThunk = (dispatch, getState) => {
  // track page with GA
  handlePageTrack(getState().location);
};

export const routes = {
  [MAP]: {
    path: '/v2/map/:tab?/:country?/:region?/:subRegion?'
  },
  [COUNTRY]: {
    path: '/dashboards/:type?/:country?/:region?/:subRegion?'
  }
};

export default connectRoutes(history, routes, {
  querySerializer: queryString,
  onAfterChange: routeChangeThunk
});
