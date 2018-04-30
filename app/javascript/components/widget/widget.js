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
  getActiveAdmin
} from './widget-selectors';
import * as Widgets from './widget-manifest';

const mapStateToProps = (
  { location, countryData, whitelists, widgets },
  { widget, locationNames, active }
) => {
  // widget consts
  const { config, settings } = widgets[widget];
  const { parseData, parseConfig, getSentence } = Widgets[widget];
  const colors = COLORS[config.colors || config.type] || COLORS;
  const highlightColor =
    colors.main || (colors.extent && colors.extent.main) || '#a0c746';
  const haveMapLayers = settings && settings.layers && !!settings.layers.length;
  const onMap = active && haveMapLayers;

  // selector data
  const activeIndicator =
    settings && settings.indicator && getActiveIndicator(settings.indicator);
  const activeLocation = getActiveAdmin({ ...location });
  const selectorData = {
    ...widgets[widget],
    ...location,
    ...countryData,
    ...whitelists,
    activeIndicator,
    activeLocation,
    locationNames,
    colors
  };
  const options = getOptions(selectorData);
  const parseSelectorData = {
    ...selectorData,
    options
  };

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
    ...selectorData,
    ...Widgets[widget],
    isMetaLoading,
    isGeostoreLoading,
    highlightColor,
    options,
    onMap,
    haveMapLayers,
    whitelist: location.payload.region
      ? whitelists.regionWhitelist
      : whitelists.countryWhitelist,
    parsedData: parseData && parseData(parseSelectorData),
    parsedConfig: parseConfig && parseConfig(parseSelectorData),
    sentence: getSentence && getSentence(parseSelectorData)
  };
};

class WidgetContainer extends PureComponent {
  componentDidMount() {
    const {
      payload,
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
          ...payload,
          ...settings
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { payload, settings, getData, getWidgetData, widget } = nextProps;
    if (
      settings &&
      (!isEqual(payload, this.props.payload) ||
        !isEqual(settings.threshold, this.props.settings.threshold) ||
        !isEqual(settings.indicator, this.props.settings.indicator) ||
        !isEqual(settings.extentYear, this.props.settings.extentYear) ||
        !isEqual(settings.type, this.props.settings.type))
    ) {
      getWidgetData({
        widget,
        getData,
        params: {
          ...payload,
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
  payload: PropTypes.object,
  getData: PropTypes.func,
  getWidgetData: PropTypes.func,
  widget: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetContainer);
