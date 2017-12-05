import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getExtent } from 'services/forest-data';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

const mapStateToProps = state => {
  const { isCountriesLoading, isRegionsLoading } = state.countryData;
  return {
    location: state.location.payload,
    areaHa: state.countryData.geostore.areaHa,
    isLoading: state.widgetTreeCover.isLoading,
    admin1List: state.countryData.regions,
    totalCover: state.widgetTreeCover.totalCover,
    totalIntactForest: state.widgetTreeCover.totalIntactForest,
    totalNonForest: state.widgetTreeCover.totalNonForest,
    title: state.widgetTreeCover.title,
    locations: state.widgetTreeCover.locations,
    units: state.widgetTreeCover.units,
    canopies: state.widgetTreeCover.canopies,
    settings: state.widgetTreeCover.settings,
    isMetaLoading: isCountriesLoading || isRegionsLoading
  };
};

class WidgetTreeCoverContainer extends PureComponent {
  componentDidMount() {
    const { location, settings } = this.props;
    this.getData({ ...location, threshold: settings.threshold, indicator: settings.indicator });
  }

  // componentWillUpdate(nextProps) {
  //   const { settings } = this.props;

  //   if (JSON.stringify(settings) !== JSON.stringify(nextProps.settings)) {
  //     this.getData(nextProps);
  //   }

  //   if (!nextProps.isMetaLoading && isMetaLoading) {
  //     this.getData(nextProps);
  //   }
  // }

  getData = newProps => {
    const {
      location,
      areaHa,
      settings,
      setTreeCoverValues,
      setTreeCoverIsLoading
    } = newProps;
    getExtent({
      ...location,
      threshold: settings.threshold,
      indicator: settings.location
    });
  };

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
  locationNames: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
