import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {
  getIndicators,
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
  const { totalArea, cover, plantations } = widgetTreeCover.data;
  const { indicator } = widgetTreeCover.settings;
  const { indicators } = widgetTreeCover.config;

  return {
    title: widgetTreeCover.title,
    anchorLink: widgetTreeCover.anchorLink,
    isLoading:
      widgetTreeCover.isLoading || isCountriesLoading || isRegionsLoading,
    location: location.payload,
    regions: countryData.regions,
    data: getTreeCoverData({ totalArea, cover, plantations, indicator }) || [],
    options:
      {
        indicators:
          getIndicators({
            whitelist: indicators,
            location: location.payload,
            ...countryData
          }) || [],
        thresholds: getThresholds()
      } || {},
    settings: widgetTreeCover.settings,
    config: widgetTreeCover.config
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
    const { locationNames, settings } = this.props;
    const { indicators, thresholds } = this.props.options;
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
  options: PropTypes.object.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
