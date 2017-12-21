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
import lowerFirst from 'lodash/lowerFirst';

import WidgetTreeCoverGainComponent from './widget-tree-gain-component';
import actions from './widget-tree-gain-actions';

export { initialState } from './widget-tree-gain-reducers';
export { default as reducers } from './widget-tree-gain-reducers';
export { default as actions } from './widget-tree-gain-actions';

const INDICATORS_WHITELIST = [
  'gadm28',
  'biodiversity_hot_spots',
  'wdpa',
  'plantations',
  'primary_forest'
];

const mapStateToProps = ({ countryData, widgetTreeCoverGain, location }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  return {
    location: location.payload,
    isLoading:
      widgetTreeCoverGain.isLoading ||
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading,
    gain: widgetTreeCoverGain.data.gain,
    extent: widgetTreeCoverGain.data.extent,
    indicators:
      getIndicators({
        whitelist: INDICATORS_WHITELIST,
        location: location.payload,
        ...countryData
      }) || [],
    thresholds: getThresholds(),
    settings: widgetTreeCoverGain.settings
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
    const { locationNames, gain, extent, indicators, settings } = this.props;

    const indicator = getActiveFilter(settings, indicators, 'indicator');
    const regionPhrase =
      settings.indicator === 'gadm28'
        ? 'region-wide'
        : `in ${indicator.label.toLowerCase()}`;

    const areaPercent = format('.1f')(100 * gain / extent);
    const firstSentence = `From 2001 to 2012, <span>${locationNames.current &&
      locationNames.current.label} (${indicator &&
      lowerFirst(indicator.label)})</span> gained <strong>${
      gain ? format('.3s')(gain) : '0'
    }ha</strong> of tree cover in ${regionPhrase}`;
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
  indicators: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeCoverGain: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverGainContainer);
