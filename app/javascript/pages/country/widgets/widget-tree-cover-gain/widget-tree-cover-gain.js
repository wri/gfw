import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { getAdminsSelected, getIndicators } from 'pages/country/utils/filters';

import WidgetTreeCoverGainComponent from './widget-tree-cover-gain-component';
import actions from './widget-tree-cover-gain-actions';

export { initialState } from './widget-tree-cover-gain-reducers';
export { default as reducers } from './widget-tree-cover-gain-reducers';
export { default as actions } from './widget-tree-cover-gain-actions';

const INDICATORS_WHITELIST = [
  'gadm28',
  'biodiversity_hot_spots',
  'wdpa',
  'gfw_plantations',
  'gfw_managed_forests',
  'IFL_2000',
  'IFL_2013'
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
    gain: widgetTreeCoverGain.gain,
    treeExtent: widgetTreeCoverGain.treeExtent,
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
      indicator: settings.indicator
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getTreeCoverGain } = nextProps;

    if (settings.indicator !== this.props.settings.indicator) {
      getTreeCoverGain({
        ...location,
        indicator: settings.indicator
      });
    }
  }

  getSentence = () => {
    const {
      locationNames,
      gain,
      treeExtent,
      indicators,
      settings
    } = this.props;

    const indicator = indicators.filter(
      item => item.value === settings.indicator
    );
    const regionPhrase =
      settings.indicator === 'gadm28'
        ? 'region-wide'
        : `in ${indicator[0].label.toLowerCase()}`;

    const areaPercent = numeral(100 * treeExtent / gain).format('0,00');

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
  treeExtent: PropTypes.number.isRequired,
  indicators: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeCoverGain: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverGainContainer);
