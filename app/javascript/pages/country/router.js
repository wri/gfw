import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import { setWidgetSettingsStore } from 'pages/country/widget/widget-actions';

const history = createHistory();

export const COUNTRY = 'location/COUNTRY';
export const EMBED = 'location/EMBED';

const syncWidgetSettings = (dispatch, getState) => {
  const { query } = getState().location;
  if (query) {
    dispatch(setWidgetSettingsStore(query));
  }
};

export const routes = {
  [EMBED]: {
    path: '/country/embed/:widget/:country/:region?/:subRegion?',
    thunk: syncWidgetSettings
  },
  [COUNTRY]: {
    path: '/country/:country/:region?/:subRegion?',
    thunk: syncWidgetSettings
  }
};

export default connectRoutes(history, routes, {
  querySerializer: queryString
});
