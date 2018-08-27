import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import { handlePageTrack } from 'utils/analytics';

const history = createHistory();

export const MAP = 'location/MAP';

const routeChangeThunk = (dispatch, getState) => {
  // track page with GA
  handlePageTrack(getState().location);
};

export const routes = {
  [MAP]: {
    path:
      '/map/:zoom?/:latitude?/:longitude?/:iso?/:basemap?/:layers?/:sublayers?'
  }
};

export default connectRoutes(history, routes, {
  querySerializer: queryString,
  onAfterChange: routeChangeThunk
});
