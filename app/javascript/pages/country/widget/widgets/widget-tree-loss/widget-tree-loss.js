import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';

import {
  getThresholds,
  getIndicators,
  getStartYears,
  getEndYears,
  getAdminsSelected,
  getActiveFilter
} from 'pages/country/widget/widget-selectors';
import { filterData } from './widget-tree-loss-selectors';

import WidgetTreeLossComponent from './widget-tree-loss-component';
import actions from './widget-tree-loss-actions';

export { initialState } from './widget-tree-loss-reducers';
export { default as reducers } from './widget-tree-loss-reducers';
export { default as actions } from './widget-tree-loss-actions';

const INDICATORS_WHITELIST = [
  'gadm28',
  'gfw_plantations',
  'gfw_managed_forests',
  'wdpa',
  'IFL_2000',
  'IFL_2013',
  'primary_forests'
];

const mapStateToProps = ({ widgetTreeLoss, location, countryData }) => ({
  isLoading: widgetTreeLoss.isLoading,
  location: location.payload,
  data:
    filterData({
      data: widgetTreeLoss.data,
      ...widgetTreeLoss.settings
    }) || [],
  extent: widgetTreeLoss.data.extent,
  startYears:
    getStartYears({
      data: widgetTreeLoss.data.loss,
      ...widgetTreeLoss.settings
    }) || [],
  endYears:
    getEndYears({
      data: widgetTreeLoss.data.loss,
      ...widgetTreeLoss.settings
    }) || [],
  indicators:
    getIndicators({
      whitelist: INDICATORS_WHITELIST,
      location: location.payload,
      ...countryData
    }) || [],
  thresholds: getThresholds(),
  settings: widgetTreeLoss.settings,
  locationNames: getAdminsSelected({
    ...countryData,
    location: location.payload
  })
});

class WidgetTreeLossContainer extends PureComponent {
  componentWillMount() {
    const { getTreeLoss, location, settings } = this.props;
    getTreeLoss({ ...location, ...settings });
  }

  componentWillUpdate(nextProps) {
    const { getTreeLoss, location, settings } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeLoss({ ...location, ...settings });
    }
  }

  getSentence = () => {
    const { locationNames, indicators, settings, data, extent } = this.props;
    const indicator = getActiveFilter(settings, indicators, 'indicator');
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && sumBy(data, 'emissions')) || 0;
    const percentageLoss = totalLoss / extent * 100;
    const locationText = `${locationNames.current &&
      locationNames.current.label} (${indicator &&
      (settings.indicator === 'gadm28'
        ? 'all regions'
        : indicator.label.toLowerCase())})`;
    return `Between <span>${settings.startYear}</span> and <span>${
      settings.endYear
    }</span>, 
      <span>${locationText}</span> lost <b>${format('.3s')(
      totalLoss
    )}ha</b> of tree cover: 
      This loss is equal to <b>${format('.1f')(
      percentageLoss
    )}%</b> of the regions tree cover extent in 2010, 
      and equivalent to <b>${format('.3s')(
      totalEmissions
    )}tonnes</b> of CO\u2082 emissions.`;
  };

  viewOnMap = () => {
    this.props.setLayers(['loss']);
  };

  render() {
    return createElement(WidgetTreeLossComponent, {
      ...this.props,
      viewOnMap: this.viewOnMap,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeLossContainer.propTypes = {
  locationNames: PropTypes.object.isRequired,
  indicators: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeLoss: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  extent: PropTypes.number.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeLossContainer);
