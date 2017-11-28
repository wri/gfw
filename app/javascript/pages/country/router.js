import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

export const COUNTRY = 'location/COUNTRY';

export const routes = {
  [COUNTRY]: {
    path: '/country/:country/:region?/:subRegion?'
  }
};

export default connectRoutes(history, routes);
