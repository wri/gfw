import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import { setWidgetSettingsStore } from 'components/widgets/actions';
import { setMapUrlToStore } from 'components/map/map-actions';
import { handlePageTrack } from 'utils/analytics';

const history = createHistory();

export const COUNTRY = 'location/COUNTRY';
export const EMBED = 'location/EMBED';

const routeChangeThunk = (dispatch, getState) => {
  // sync store with widget settings
  const { query } = getState().location;
  if (query) {
    dispatch(setWidgetSettingsStore(query));
  }
  if (query && query.map) {
    dispatch(setMapUrlToStore(query));
  }

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
  querySerializer: queryString,
  onAfterChange: routeChangeThunk
});
