import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';

import Component from './component';
import * as Widgets from '../../manifest';
import * as Selectors from './selectors';

const mapStateToProps = ({ widgets, location }, ownProps) => {
  const { widget, colors, active, options } = ownProps;
  const { query } = location;
  const { country, region, subRegion, type } = location.payload;
  // widget consts
  const { config, settings } = widgets[widget];
  const { getOptionsSelected, getIndicator, getNonGlobalDatasets } = Selectors;
  const highlightColor = colors.main || '#a0c746';
  const haveMapLayers = settings && !isEmpty(settings.layers);
  const onMap = active && haveMapLayers;
  const { parseData, parseConfig, getSentence } = Widgets[widget];

  // selector data
  const optionsSelected =
    settings && getOptionsSelected({ ...ownProps, settings });
  const selectorData = {
    ...ownProps,
    ...widgets[widget],
    ...optionsSelected,
    indicator: optionsSelected && getIndicator({ ...optionsSelected })
  };
  const filteredOptions = {};
  if (config.selectors) {
    config.selectors.forEach(selector => {
      const selectorFunc = Selectors[`get${upperFirst(selector)}`];
      filteredOptions[selector] = selectorFunc
        ? selectorFunc(selectorData)
        : options[selector];
    });
  }
  const nonGlobalDatasets = getNonGlobalDatasets({
    ...widgets.global,
    ...selectorData
  });

  const category = query && query.category;
  const locationUrl = `${country || ''}${region ? `/${region}` : ''}${
    subRegion ? `/${subRegion}` : ''
  }`;
  const locationPath = `dashboards/${type || 'global'}/${locationUrl}`;
  const widgetQuery = `widget=${widget}`;
  const widgetState =
    query && query[widget] ? `&${widget}=${query[widget]}` : '';
  const categoryQuery = category ? `&category=${category}` : '';

  const shareUrl = `${window.location.origin}/${locationPath}?${widgetQuery}${
    widgetState ? `${widgetState}` : ''
  }${categoryQuery}#${widget}`;
  const embedUrl = `${window.location.origin}/embed/${locationPath}?${
    widgetQuery
  }${widgetState}`;

  return {
    ...Widgets[widget],
    ...selectorData,
    highlightColor,
    options: filteredOptions,
    onMap,
    haveMapLayers,
    parsedData: parseData && parseData(selectorData),
    parsedConfig: parseConfig && parseConfig(selectorData),
    sentence: getSentence && getSentence(selectorData),
    shareUrl,
    embedUrl,
    nonGlobalDatasets
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
      geostore
    } = this.props;
    getWidgetData({
      widget,
      getData,
      params: {
        ...payload,
        ...settings,
        geostore
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      payload,
      settings,
      getData,
      getWidgetData,
      widget,
      geostore
    } = nextProps;
    if (
      settings &&
      this.props.settings &&
      (!isEqual(payload, this.props.payload) ||
        !isEqual(settings.threshold, this.props.settings.threshold) ||
        !isEqual(settings.forestType, this.props.settings.forestType) ||
        !isEqual(settings.landCategory, this.props.settings.landCategory) ||
        !isEqual(settings.extentYear, this.props.settings.extentYear) ||
        !isEqual(settings.period, this.props.settings.period) ||
        !isEqual(settings.type, this.props.settings.type))
    ) {
      getWidgetData({
        widget,
        getData,
        params: {
          ...payload,
          ...settings,
          geostore
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
  geostore: PropTypes.object
};

export default connect(mapStateToProps, null)(WidgetContainer);
