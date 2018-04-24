import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import upperFirst from 'lodash/upperFirst';
import COLORS from 'data/colors.json';

import Component from './widget-component';
import actions from './widget-actions';
import reducers, { initialState } from './widget-reducers';
import * as widgetSelectors from './widget-selectors';
import * as Widgets from './widget-manifest';

const mapStateToProps = (state, ownProps) => {
  const widget = ownProps.widget;
  const widgetFuncs = Widgets[widget];
  const { location, countryData, whitelists } = state;
  const { title, config, settings, loading, data, error } = state.widgets[widget];
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
  const adminData = {
    location: location.payload,
    countries: countryData.countries,
    regions: countryData.regions,
    subRegions: countryData.subRegions
  };
  const activeIndicator =
    settings &&
    settings.indicator &&
    widgetSelectors.getActiveIndicator(settings.indicator);
  const locationNames = widgetSelectors.getAdminsSelected(adminData);
  const selectorData = {
    data,
    settings,
    whitelist: whitelists.countryWhitelist,
    locationNames,
    activeIndicator,
    colors: COLORS[config.colors || config.type] || COLORS
  };
  const options = {};
  if (config.selectors) {
    config.selectors.forEach(selector => {
      const selectorFunc = widgetSelectors[`get${upperFirst(selector)}`];
      switch (selector) {
        case 'indicators':
          options[selector] = selectorFunc({
            config,
            location: location.payload,
            ...countryData,
            ...whitelists
          });
          break;
        case 'years':
        case 'units':
          options[selector] = selectorFunc({
            config,
            ...settings
          });
          break;
        case 'startYears':
        case 'endYears':
          options[selector] = selectorFunc({
            config,
            data: data.loss || (data.regions && data.regions[0].loss),
            ...settings
          });
          break;
        default:
          options[selector] = selectorFunc({ config });
      }
    });
  }
  return {
    isMetaLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      countryWhitelistLoading ||
      regionWhitelistLoading ||
      waterBodiesLoading,
    isGeostoreLoading,
    locationNames,
    activeLocation: widgetSelectors.getActiveAdmin({
      location: location.payload
    }),
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
    parsedData: widgetFuncs.parseData(selectorData),
    sentence: widgetFuncs.getSentence(selectorData),
    settings
  };
};

class WidgetContainer extends PureComponent {
  componentDidMount() {
    const { location, settings, getData, getWidgetData, widget } = this.props;
    getWidgetData({
      widget,
      getData,
      params: {
        ...location,
        ...settings
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getData, getWidgetData, widget } = nextProps;
    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings, this.props.settings)
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
  widget: PropTypes.string
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetContainer);
