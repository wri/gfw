import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { getActiveFilter } from 'pages/country/widget/widget-selectors';

import actions from './widget-tree-cover-actions';
import reducers, { initialState } from './widget-tree-cover-reducers';
import { getTreeCoverData } from './widget-tree-cover-selectors';
import WidgetTreeCoverComponent from './widget-tree-cover-component';

const mapStateToProps = ({ widgetTreeCover, countryData }) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const { totalArea, cover, plantations } = widgetTreeCover.data;
  const { indicator } = widgetTreeCover.settings;

  return {
    loading: widgetTreeCover.loading || isCountriesLoading || isRegionsLoading,
    regions: countryData.regions,
    data: getTreeCoverData({ totalArea, cover, plantations, indicator }) || []
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

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
