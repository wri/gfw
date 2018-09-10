import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import colors from 'data/colors.json';

import Component from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import {
  getAdminSelected,
  getOptions,
  filterWidgets,
  getAdminKey
} from './selectors';

const mapStateToProps = ({ countryData, whitelists, widgets }, ownProps) => {
  const { activeWidget, location, query } = ownProps;
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

  const { region } = location;
  const widget = query && query.widget;
  const category = (query && query.category) || 'summary';
  const widgetData = {
    category,
    location,
    countryData,
    whitelist: region ? regionWhitelist : countryWhitelist
  };
  const currentLocation = getAdminSelected({ ...countryData, location });

  return {
    loading,
    widgets: (!widget && ownProps.widgets) || filterWidgets(widgetData),
    options: getOptions(),
    adminKey: getAdminKey({ location }),
    currentLocation,
    currentLabel: currentLocation && currentLocation.label,
    ...currentLocation,
    ...widgetData,
    ...countryData,
    ...whitelists,
    colors,
    activeWidget,
    ...(!!widget && { widget: widgets[widget] })
  };
};

class WidgetsContainer extends PureComponent {
  componentDidMount() {
    const { getGlobalData } = this.props;
    getGlobalData();
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

WidgetsContainer.propTypes = {
  getGlobalData: PropTypes.func
};

export const reduxModule = { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetsContainer);
