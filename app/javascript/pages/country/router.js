import { connectRoutes } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import actions from 'pages/country/widget/widget-actions';

const history = createHistory();

export const COUNTRY = 'location/COUNTRY';
export const EMBED = 'location/EMBED';

const countryThunk = (dispatch, getState) => {
  const { query } = getState().location;
  if (query) {
    dispatch(actions.setWidgetConfigStore(query));
  }
};

export const routes = {
  [EMBED]: {
    path: '/country/embed/:widget/:country/:region?/:subRegion?'
  },
  [COUNTRY]: {
    path: '/country/:country/:region?/:subRegion?',
    thunk: countryThunk
  }
};

export default connectRoutes(history, routes, {
  querySerializer: queryString
});
