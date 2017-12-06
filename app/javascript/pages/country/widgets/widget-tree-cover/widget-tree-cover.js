import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { thresholds } from 'pages/country/utils/constants';
import { getAdminsSelected, getIndicators, getUnits } from 'pages/country/utils/filters';

import WidgetTreeCoverComponent from './widget-tree-cover-component';
import actions from './widget-tree-cover-actions';

export { initialState } from './widget-tree-cover-reducers';
export { default as reducers } from './widget-tree-cover-reducers';
export { default as actions } from './widget-tree-cover-actions';

const INDICATORS_WHITELIST = ['gadm28', 'wpda', 'ifl_2013', 'ifl_2013__wdpa', 'ifl_2013__mining'];
const UNIT_WHITELIST = ['ha', '%'];

const mapStateToProps = ({ widgetTreeCover, countryData, location }) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const totalArea = widgetTreeCover.totalArea;
  const totalCover = widgetTreeCover.totalCover;
  const totalIntactForest = widgetTreeCover.totalIntactForest;
  const totalNonForest = widgetTreeCover.totalNonForest;
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
      widgetTreeCover.isLoading || isCountriesLoading || isRegionsLoading,
    location: location.payload,
    regions: countryData.regions,
    data,
    adminsSelected: getAdminsSelected({
      ...countryData,
      location: location.payload
    }),
    units: getUnits({ whitelist: UNIT_WHITELIST }),
    thresholds,
    indicators: getIndicators({ whitelist: INDICATORS_WHITELIST, location: location.payload, ...countryData }) || [],
    settings: widgetTreeCover.settings
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
    const { adminsSelected, settings, indicators } = this.props;
    if (adminsSelected && indicators.length) {
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
    }
    return '';
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
  adminsSelected: PropTypes.object.isRequired,
  indicators: PropTypes.array.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeCoverContainer);
