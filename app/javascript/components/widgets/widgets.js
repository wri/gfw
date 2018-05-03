import { connect } from 'react-redux';
import replace from 'lodash/replace';

import colors from 'data/colors.json';

import Component from './component';
import actions from './actions';
import reducers, { initialState } from './reducers';
import {
  getActiveAdmin,
  getAdminsSelected,
  getOptions,
  filterWidgets
} from './selectors';

import * as Widgets from './manifest';

const mapStateToProps = ({ location, countryData, whitelists }) => {
  // loaders
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  const {
    countryWhitelistLoading,
    regionWhitelistLoading,
    regionWhitelist,
    countryWhitelist
  } = whitelists;
  const loading =
    isCountriesLoading ||
    isRegionsLoading ||
    isSubRegionsLoading ||
    countryWhitelistLoading ||
    regionWhitelistLoading;

  const { query } = location;
  const activeLocation = getActiveAdmin(location);
  const locationNames = getAdminsSelected({ ...countryData, ...location });
  const category = query && query.category;
  const activeWidget = query && query.activeWidget;

  const widgetData = {
    category,
    activeLocation,
    ...location,
    ...countryData,
    locationOptions: countryData,
    indicatorWhitelist: location.payload.region
      ? regionWhitelist
      : countryWhitelist
  };

  return {
    loading,
    WidgetsFuncs: Widgets,
    widgets: filterWidgets(widgetData),
    activeWidget:
      replace(window.location.hash, '#', '') ||
      (location.query && location.query.widget) ||
      activeWidget,
    locationNames,
    activeLocation,
    currentLocation:
      locationNames && locationNames.current && locationNames.current.label,
    options: getOptions(),
    whitelists,
    category,
    colors,
    ...countryData,
    ...location
  };
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
