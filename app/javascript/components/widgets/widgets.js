import { connect } from 'react-redux';
import colors from 'data/colors.json';

import Component from './component';
import actions from './actions';
import reducers, { initialState } from './reducers';
import { getAdminSelected, getOptions, filterWidgets } from './selectors';

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

  const { query, payload } = location;
  const category = (query && query.category) || 'summary';
  const activeWidget = query && query.widget;

  const widgetData = {
    category,
    ...location,
    countryData,
    indicatorWhitelist: location.payload.region
      ? regionWhitelist
      : countryWhitelist
  };
  const currentLocation = getAdminSelected({ countryData, payload });

  return {
    loading,
    WidgetsFuncs: Widgets,
    widgets: filterWidgets(widgetData),
    options: getOptions(),
    currentLocation,
    currentLabel: currentLocation && currentLocation.label,
    ...widgetData,
    ...whitelists,
    whitelist: payload.region
      ? whitelists.regionWhitelist
      : whitelists.countryWhitelist,
    colors,
    activeWidget
  };
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
