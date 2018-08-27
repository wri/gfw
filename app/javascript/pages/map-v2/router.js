import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import { handlePageTrack } from 'utils/analytics';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';

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
  }
};

export default connectRoutes(history, routes, {
  querySerializer: {
    parse: decodeUrlForState,
    stringify: encodeStateForUrl
  },
  onAfterChange: routeChangeThunk
});
