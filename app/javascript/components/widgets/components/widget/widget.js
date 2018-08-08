import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';

import Component from './component';
import * as Widgets from '../../manifest';
import * as Selectors from './selectors';

const mapStateToProps = ({ widgets }, ownProps) => {
  const { widget, colors, active, options, location, query } = ownProps;
  const { country, region, subRegion, type } = location;
  // widget consts
  const settings = Selectors.getWidgetSettings({
    settings: widgets[widget].settings,
    urlState: query && query[widget]
  });
  const { config } = widgets[widget];
  const { getOptionsSelected, getIndicator } = Selectors;
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
    settings,
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

  const category = query && query.category;
  const locationUrl = `${country || ''}${region ? `/${region}` : ''}${
    subRegion ? `/${subRegion}` : ''
  }`;
  const locationPath = `dashboards/${type || 'global'}/${locationUrl}`;
  const widgetQuery = `widget=${widget}`;
  const widgetState =
    query && query[widget]
      ? `&${widget}=${btoa(JSON.stringify(query[widget]))}`
      : '';
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
    ...widgets.global
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
      geostore
    } = this.props;
    getWidgetData({
      widget,
      getData,
      params: {
        ...location,
        ...settings,
        geostore
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      location,
      settings,
      getData,
      getWidgetData,
      widget,
      geostore
    } = nextProps;
    if (
      settings &&
      this.props.settings &&
      (!isEqual(location, this.props.location) ||
        !isEqual(settings.threshold, this.props.settings.threshold) ||
        !isEqual(settings.forestType, this.props.settings.forestType) ||
        !isEqual(settings.landCategory, this.props.settings.landCategory) ||
        !isEqual(settings.extentYear, this.props.settings.extentYear) ||
        !isEqual(settings.period, this.props.settings.period) ||
        !isEqual(settings.type, this.props.settings.type) ||
        !isEqual(settings.dataset, this.props.settings.dataset))
    ) {
      getWidgetData({
        widget,
        getData,
        params: {
          ...location,
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
  location: PropTypes.object,
  getData: PropTypes.func,
  getWidgetData: PropTypes.func,
  widget: PropTypes.string,
  geostore: PropTypes.object
};

export default connect(mapStateToProps, null)(WidgetContainer);
