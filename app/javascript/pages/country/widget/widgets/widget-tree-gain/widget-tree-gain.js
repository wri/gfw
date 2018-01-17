import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-tree-gain-actions';
import reducers, { initialState } from './widget-tree-gain-reducers';
import { getSortedData, getSentence } from './widget-tree-gain-selectors';
import WidgetTreeGainComponent from './widget-tree-gain-component';

const mapStateToProps = (
  { location, widgetTreeGain, countryData },
  ownProps
) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const { locationNames, activeIndicator } = ownProps;
  const { data: { ranking, gain, extent }, settings } = widgetTreeGain;
  let meta = countryData.countries;
  if (location.payload.subRegion) {
    meta = countryData.subRegions;
  } else if (location.payload.region) {
    meta = countryData.regions;
  }

  const selectorData = {
    ranking,
    gain,
    extent,
    settings,
    location: location.payload,
    meta,
    indicator: activeIndicator,
    locationNames
  };

  return {
    loading: widgetTreeGain.loading || isCountriesLoading || isRegionsLoading,
    data: {
      gain: widgetTreeGain.data.gain,
      extent: widgetTreeGain.data.extent,
      ranking: getSortedData(selectorData)
    },
    sentence: getSentence(selectorData)
  };
};

class WidgetTreeGainContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getTreeGain } = this.props;
    getTreeGain({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getTreeGain } = nextProps;
    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear)
    ) {
      getTreeGain({
        ...location,
        ...settings
      });
    }
  }

  render() {
    return createElement(WidgetTreeGainComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeGainContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeGain: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeGainContainer);
