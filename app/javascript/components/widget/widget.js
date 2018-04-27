import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import COLORS from 'data/colors.json';

import Component from './widget-component';
import actions from './widget-actions';
import reducers, { initialState } from './widget-reducers';
import {
  getOptions,
  getActiveIndicator,
  getAdminsSelected,
  getActiveAdmin
} from './widget-selectors';
import * as Widgets from './widget-manifest';

const mapStateToProps = (
  { location, countryData, whitelists, widgets },
  ownProps
) => {
  // widget consts
  const widget = ownProps.widget;
  const { parseData, parseConfig, getSentence } = Widgets[widget];
  const { title, config, settings, loading, data, error } = widgets[widget];
  const colors = COLORS[config.colors || config.type] || COLORS;

  // selector data
  const activeIndicator =
    settings && settings.indicator && getActiveIndicator(settings.indicator);
  const selectorData = {
    data,
    settings,
    location: location.payload,
    query: location.search,
    countryData,
    whitelists,
    activeIndicator,
    config,
    colors,
    countries: countryData.countries,
    regions: countryData.regions,
    subRegions: countryData.subRegions
  };
  const locationNames = getAdminsSelected(selectorData);
  const activeLocation = getActiveAdmin(selectorData);
  const options = getOptions(selectorData);

  // loaders
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading,
    isGeostoreLoading
  } = countryData;
  const {
    countryWhitelistLoading,
    regionWhitelistLoading,
    waterBodiesLoading
  } = whitelists;
  const isMetaLoading =
    isCountriesLoading ||
    isRegionsLoading ||
    isSubRegionsLoading ||
    countryWhitelistLoading ||
    regionWhitelistLoading ||
    waterBodiesLoading;

  return {
    isMetaLoading,
    isGeostoreLoading,
    locationNames,
    activeLocation,
    activeIndicator,
    location: location.payload,
    query: location.query,
    whitelist: location.payload.region
      ? whitelists.regionWhitelist
      : whitelists.countryWhitelist,
    title,
    loading,
    error,
    colors: COLORS[config.colors || config.type] || COLORS,
    settingsConfig: {
      config,
      settings,
      options,
      loading
    },
    ...Widgets[widget],
    widget,
    data,
    parsedData:
      parseData &&
      parseData({
        ...selectorData,
        locationNames,
        options
      }),
    parsedConfig:
      parseConfig &&
      parseConfig({
        ...selectorData,
        locationNames,
        options
      }),
    sentence:
      getSentence &&
      getSentence({
        ...selectorData,
        locationNames,
        options
      }),
    settings
  };
};

class WidgetContainer extends PureComponent {
  componentDidMount() {
    const {
      location,
      settings,
      getData,
      getWidgetData,
      widget,
      data
    } = this.props;
    if (isEmpty(data)) {
      getWidgetData({
        widget,
        getData,
        params: {
          ...location,
          ...settings
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getData, getWidgetData, widget } = nextProps;
    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.threshold, this.props.settings.threshold) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear) ||
      !isEqual(settings.type, this.props.settings.type)
    ) {
      getWidgetData({
        widget,
        getData,
        params: {
          ...location,
          ...settings
        }
      });
    }
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

WidgetContainer.propTypes = {
  settings: PropTypes.object,
  location: PropTypes.object,
  getData: PropTypes.func,
  getWidgetData: PropTypes.func,
  widget: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetContainer);
