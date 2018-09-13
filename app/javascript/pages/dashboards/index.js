import { connect } from 'react-redux';
import replace from 'lodash/replace';

import CATEGORIES from 'data/categories.json';

import { filterWidgets } from 'components/widgets/selectors';
import * as mapActions from 'components/map/actions';

import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import { getLinks, getTitle } from './selectors';
import Component from './component';

const actions = { ...mapActions, ...ownActions };

const mapStateToProps = ({ dashboards, countryData, whitelists, location }) => {
  const category = (location.query && location.query.category) || 'summary';
  const { regionWhitelist, countryWhitelist } = whitelists;
  const widgetHash =
    window.location.hash && replace(window.location.hash, '#', '');
  const widgetAnchor = document.getElementById(widgetHash);
  const activeWidget =
    replace(window.location.hash, '#', '') ||
    (location.query && location.query.widget);
  const widgetData = {
    category,
    location: location.payload,
    query: location.query,
    countryData,
    whitelist: location.payload.region ? regionWhitelist : countryWhitelist
  };
  const widgets = filterWidgets(widgetData);

  return {
    showMapMobile: dashboards.showMapMobile,
    links: getLinks({ categories: CATEGORIES, ...location, category }),
    isGeostoreLoading: countryData.isGeostoreLoading,
    category,
    widgets,
    activeWidget: activeWidget || (widgets && widgets[0] && widgets[0].name),
    widgetAnchor,
    title: getTitle({ ...countryData, ...location }),
    ...location,
    ...countryData
  };
};

export const reduxModule = { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
