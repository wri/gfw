import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import {
  getAdminsSelected,
  getIndicators,
  getActiveFilter
} from 'pages/country/utils/filters';
import isEqual from 'lodash/isEqual';

import WidgetTreeCoverGainComponent from './widget-tree-cover-gain-component';
import actions from './widget-tree-cover-gain-actions';

export { initialState } from './widget-tree-cover-gain-reducers';
export { default as reducers } from './widget-tree-cover-gain-reducers';
export { default as actions } from './widget-tree-cover-gain-actions';

const INDICATORS_WHITELIST = [
  'gadm28',
  'biodiversity_hot_spots',
  'wdpa',
  'primary_forests',
  'ifl_2013'
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
    settings: widgetTreeCoverGain.settings,
    locationNames: getAdminsSelected({
      ...countryData,
      location: location.payload
    })
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
      !isEqual(nextProps.location, this.props.location) ||
      !isEqual(settings.indicator !== this.props.settings.indicator)
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

    const areaPercent = numeral(100 * extent / gain).format('0,00');

    return {
      __html: `From 2001 to 2012, ${locationNames.current &&
        locationNames.current.label} gained <strong>${numeral(gain).format(
        '0,0'
      )} ha</strong> of tree cover in ${regionPhrase}, equivalent to a <strong>${areaPercent}%</strong> increase relative to 2010 tree cover extent.`
    };
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
