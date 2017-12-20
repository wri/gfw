import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {
  getIndicators,
  getUnits,
  getThresholds,
  getActiveFilter
} from 'pages/country/widget/widget-selectors';
import { getTreeCoverData } from './widget-tree-cover-selectors';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

const mapStateToProps = ({ widgetTreeCover, countryData, location }) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const { indicators } = widgetTreeCover.config;
  const { totalArea, cover, plantations } = widgetTreeCover.data;

  return {
    isLoading:
      widgetTreeCover.isLoading || isCountriesLoading || isRegionsLoading,
    location: location.payload,
    regions: countryData.regions,
    data: getTreeCoverData({ totalArea, cover, plantations }) || [],
    indicators:
      getIndicators({
        whitelist: indicators,
        location: location.payload,
        ...countryData
      }) || [],
    units: getUnits(),
    thresholds: getThresholds(),
    settings: widgetTreeCover.settings,
    isMetaLoading: isCountriesLoading || isRegionsLoading
  };
};

class WidgetTreeCoverContainer extends PureComponent {
  componentDidMount() {
    const { location, settings, getTreeCover } = this.props;
    getTreeCover({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, getTreeCover, location } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeCover({
        ...location,
        ...settings
      });
    }
  }

  getSentence = () => {
    const { locationNames, settings, indicators, thresholds } = this.props;
    if (locationNames && indicators.length) {
      const activeThreshold = thresholds.find(
        t => t.value === settings.threshold
      );
      const indicator = getActiveFilter(settings, indicators, 'indicator');
      return `Tree  cover for 
        ${indicator.label} of 
        ${locationNames.current &&
          locationNames.current.label} with a tree canopy of 
        ${activeThreshold.label}`;
    }
    return '';
  };

  render() {
    return createElement(WidgetTreeCoverComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeCoverContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  locationNames: PropTypes.object.isRequired,
  getTreeCover: PropTypes.func.isRequired,
  indicators: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
