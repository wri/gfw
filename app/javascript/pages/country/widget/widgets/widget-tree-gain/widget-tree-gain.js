import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import {
  getIndicators,
  getActiveFilter,
  getThresholds
} from 'pages/country/widget/widget-selectors';
import isEqual from 'lodash/isEqual';

import WidgetTreeCoverGainComponent from './widget-tree-gain-component';
import actions from './widget-tree-gain-actions';

export { initialState } from './widget-tree-gain-reducers';
export { default as reducers } from './widget-tree-gain-reducers';
export { default as actions } from './widget-tree-gain-actions';

const mapStateToProps = ({ countryData, widgetTreeCoverGain, location }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  const { indicators } = widgetTreeCoverGain.config;
  return {
    location: location.payload,
    isLoading:
      widgetTreeCoverGain.isLoading ||
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading,
    gain: widgetTreeCoverGain.data.gain,
    extent: widgetTreeCoverGain.data.extent,
    options: {
      indicators:
        getIndicators({
          whitelist: indicators,
          location: location.payload,
          ...countryData
        }) || [],
      thresholds: getThresholds()
    },
    settings: widgetTreeCoverGain.settings,
    config: widgetTreeCoverGain.config
  };
};

class WidgetTreeCoverGainContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getTreeCoverGain } = this.props;
    getTreeCoverGain({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getTreeCoverGain } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings, this.props.settings)
    ) {
      getTreeCoverGain({
        ...location,
        ...settings
      });
    }
  }

  getSentence = () => {
    const { locationNames, gain, extent, settings } = this.props;
    const { indicators } = this.props.options;

    const indicator = getActiveFilter(settings, indicators, 'indicator');
    const regionPhrase =
      settings.indicator === 'gadm28'
        ? '<span>region-wide</span>'
        : `in <span>${indicator.label.toLowerCase()}</span>`;

    const areaPercent = format('.1f')(100 * gain / extent);
    const firstSentence = `From 2001 to 2012, <span>${locationNames.current &&
      locationNames.current.label}</span> gained <strong>${
      gain ? format('.3s')(gain) : '0'
    }ha</strong> of tree cover ${regionPhrase}`;
    const secondSentence = gain
      ? `, equivalent to a <strong>${areaPercent}%</strong> increase relative to 2010 tree cover extent.`
      : '.';

    return `${firstSentence}${secondSentence}`;
  };

  render() {
    return createElement(WidgetTreeCoverGainComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeCoverGainContainer.propTypes = {
  locationNames: PropTypes.object.isRequired,
  gain: PropTypes.number.isRequired,
  extent: PropTypes.number.isRequired,
  options: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeCoverGain: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverGainContainer);
