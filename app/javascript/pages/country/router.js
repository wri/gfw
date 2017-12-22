import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

export const COUNTRY = 'location/COUNTRY';
export const EMBED = 'location/EMBED';

export const routes = {
  [EMBED]: {
    path: '/country/embed/:widget/:country/:region?/:subRegion?'
  },
  [COUNTRY]: {
    path: '/country/:country/:region?/:subRegion?',
    label: 'Summary',
    submenu: true,
    active: true
  }
};

export default connectRoutes(history, routes);
