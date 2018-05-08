import { connect } from 'react-redux';
import colors from 'data/colors.json';

import Component from './component';
import actions from './actions';
import reducers, { initialState } from './reducers';
import {
  getAdminSelected,
  getOptions,
  filterWidgets,
  getAdminKey
} from './selectors';

const mapStateToProps = (
  { location, countryData, whitelists, widgets },
  ownProps
) => {
  const { widget, activeWidget } = ownProps;
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
    widgets: (!widget && ownProps.widgets) || filterWidgets(widgetData),
    options: getOptions(),
    adminKey: getAdminKey({ payload }),
    currentLocation,
    currentLabel:
      (currentLocation && currentLocation.label) || payload.type || 'global',
    ...widgetData,
    ...whitelists,
    ...countryData,
    colors,
    activeWidget,
    ...(!!widget && { widget: widgets[widget] })
  };
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(Component);
