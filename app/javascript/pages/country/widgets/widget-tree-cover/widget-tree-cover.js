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
  const totalArea = state.widgetTreeCover.totalArea;
  const totalCover = state.widgetTreeCover.totalCover;
  const totalIntactForest = state.widgetTreeCover.totalIntactForest;
  const totalNonForest = state.widgetTreeCover.totalNonForest;
  const data = [
    {
      name: 'Forest',
      value: totalCover,
      color: '#959a00',
      percentage: totalCover / totalArea * 100
    },
    {
      name: 'Intact Forest',
      value: totalIntactForest,
      color: '#2d8700',
      percentage: totalIntactForest / totalArea * 100
    },
    {
      name: 'Non Forest',
      value: totalNonForest,
      color: '#d1d1d1',
      percentage: totalNonForest / totalArea * 100
    }
  ];
  return {
    isLoading:
      state.widgetTreeCover.isLoading || isCountriesLoading || isRegionsLoading,
    location: state.location.payload,
    regions: state.countryData.regions,
    data,
    adminsSelected: getAdminsSelected({
      ...state.countryData,
      location: state.location.payload
    }),
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
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeCover({
        ...location,
        threshold: settings.threshold,
        indicator: settings.indicator
      });
    }
  }

  getTitle = () => {
    const { adminsSelected, settings } = this.props;
    const activeThreshold = thresholds.find(
      t => t.value === settings.threshold
    );
    const activeIndicator = indicators.find(
      i => i.value === settings.indicator
    );
    return `Tree  cover for 
      ${activeIndicator.label} of 
      ${adminsSelected.current &&
        adminsSelected.current.label} with a tree canopy of 
      ${activeThreshold.label}`;
  };

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
  getTreeCover: PropTypes.func.isRequired,
  adminsSelected: PropTypes.object.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
