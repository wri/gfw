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

  const { query } = location;
  const currentLocation = getAdminSelected({ ...countryData, ...location });
  const category = query && query.category;
  const activeWidget = query && query.widget;

  const widgetData = {
    category,
    ...location,
    ...countryData,
    currentLocation,
    locationOptions: countryData,
    indicatorWhitelist: location.payload.region
      ? regionWhitelist
      : countryWhitelist
  };

  return {
    loading,
    WidgetsFuncs: Widgets,
    widgets: filterWidgets(widgetData),
    options: getOptions(),
    ...widgetData,
    ...whitelists,
    colors,
    activeWidget
  };
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
