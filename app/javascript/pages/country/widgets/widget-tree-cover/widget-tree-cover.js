import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { canopies, units } from 'pages/country/utils/constants';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

const mapStateToProps = state => {
  const { isCountriesLoading, isRegionsLoading } = state.countryData;
  return {
    isLoading: state.widgetTreeCover.isLoading,
    isMetaLoading: isCountriesLoading || isRegionsLoading,
    location: state.location.payload,
    regions: state.countryData.regions,
    totalCover: state.widgetTreeCover.totalCover,
    totalIntactForest: state.widgetTreeCover.totalIntactForest,
    totalNonForest: state.widgetTreeCover.totalNonForest,
    locations: [],
    units,
    canopies,
    settings: state.widgetTreeCover.settings
  };
};

class WidgetTreeCoverContainer extends PureComponent {
  componentDidMount() {
    const { location, settings, getTreeCover } = this.props;
    getTreeCover({ ...location, threshold: settings.canopy, indicator: settings.indicator });
  }

  componentWillUpdate(nextProps) {
    const { settings, getTreeCover, location } = nextProps;

    if (!isEqual(nextProps.location, this.props.location) || !isEqual(settings, this.props.settings)) {
      getTreeCover({ ...location, threshold: settings.canopy, indicator: settings.indicator });
    }
  }

  getTitle = () => {
    const { locationNames, settings } = this.props;

    const region =
      settings.location !== 'all' ? ` and ${settings.locationLabel}` : '';

    return `Forest cover ${region} in ${locationNames.country &&
      locationNames.country.label}`;
  };

  render() {
    return createElement(WidgetTreeCoverComponent, {
      ...this.props
    });
  }
}

WidgetTreeCoverContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeCover: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
