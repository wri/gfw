import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';

import Component from './component';
import * as Selectors from './selectors';

const mapStateToProps = (
  { location, whitelists, widgets, countryData },
  ownProps
) => {
  const {
    widget,
    colors,
    active,
    options,
    parseData,
    parseConfig,
    getSentence
  } = ownProps;
  // widget consts
  const { config, settings } = widgets[widget];
  const highlightColor =
    colors.main || (colors.extent && colors.extent.main) || '#a0c746';
  const haveMapLayers = settings && settings.layers && !!settings.layers.length;
  const onMap = active && haveMapLayers;

  // selector data
  const selectorData = {
    ...ownProps,
    ...widgets[widget],
    optionsSelected,
    colors: colors[config.colors || config.type] || colors
  };
  const optionsSelected =
    settings &&
    Selectors.getOptionsSelectedMeta({
      options,
      settings
    });
  const parseSelectorData = {
    ...selectorData,
    optionsSelected
  };
  const filteredOptions = {};
  if (config.selectors) {
    config.selectors.forEach(selector => {
      const selectorFunc = Selectors[`get${upperFirst(selector)}`];
      if (selectorFunc) {
        filteredOptions[selector] = selectorFunc(selectorData);
      }
    });
  }

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
    optionsSelected,
    isMetaLoading,
    isGeostoreLoading,
    highlightColor,
    options: filteredOptions,
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
      this.props.settings &&
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

export default connect(mapStateToProps, null)(WidgetContainer);
