import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { thresholds, units, indicators } from 'pages/country/utils/constants';
import { getAdminsSelected } from 'pages/country/utils/filters';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

const mapStateToProps = state => {
  const { isCountriesLoading, isRegionsLoading } = state.countryData;
  return {
    isLoading:
      state.widgetTreeCover.isLoading || isCountriesLoading || isRegionsLoading,
    location: state.location.payload,
    regions: state.countryData.regions,
    totalCover: state.widgetTreeCover.totalCover,
    adminsSelected: getAdminsSelected({
      ...state.countryData,
      location: state.location.payload
    }),
    totalIntactForest: state.widgetTreeCover.totalIntactForest,
    totalNonForest: state.widgetTreeCover.totalNonForest,
    units,
    thresholds,
    indicators,
    settings: state.widgetTreeCover.settings
  };
};

class WidgetTreeCoverContainer extends PureComponent {
  componentDidMount() {
    const { location, settings, getTreeCover } = this.props;
    getTreeCover({
      ...location,
      threshold: settings.threshold,
      indicator: settings.indicator
    });
  }

  componentWillUpdate(nextProps) {
    const { settings, getTreeCover, location } = nextProps;

    if (
      !isEqual(nextProps.location, this.props.location) ||
      !isEqual(settings, this.props.settings)
    ) {
      getTreeCover({
        ...location,
        threshold: settings.threshold,
        indicator: settings.indicator
      });
    }
  }

  render() {
    return createElement(WidgetTreeCoverComponent, {
      ...this.props,
      getTitle: this.getTitle
    });
  }
}

WidgetTreeCoverContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeCover: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
