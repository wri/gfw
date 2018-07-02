import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import { handlePageTrack } from 'utils/analytics';
import { setMapUrlToStore } from 'components/map/map-actions';

const history = createHistory();

export const MAP = 'location/MAP';

const routeChangeThunk = (dispatch, getState) => {
  // sync store with widget settings
  const { query } = getState().location;
  if (query && query.map) {
    dispatch(setMapUrlToStore(query));
  }

  // track page with GA
  handlePageTrack(getState().location);
};

export const routes = {
  [MAP]: {
    path: '/v2/map'
  }
};

export default connectRoutes(history, routes, {
  querySerializer: queryString,
  onAfterChange: routeChangeThunk
});
