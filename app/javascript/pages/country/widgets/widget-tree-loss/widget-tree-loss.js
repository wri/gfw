import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import isEqual from 'lodash/isEqual';

import {
  getCanopies,
  getIndicators,
  getStartYears,
  getEndYears,
  getAdminsSelected,
  getActiveFilter
} from 'pages/country/utils/filters';

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
  loss: widgetTreeLoss.data.loss,
  extent: widgetTreeLoss.data.extent,
  startYears:
    getStartYears({
      data: widgetTreeLoss.data.loss,
      ...widgetTreeLoss.settings
    }) || [],
  endYears:
    getEndYears({ data: widgetTreeLoss.data, ...widgetTreeLoss.settings }) ||
    [],
  indicators:
    getIndicators({
      whitelist: INDICATORS_WHITELIST,
      location: location.payload,
      ...countryData
    }) || [],
  canopies: getCanopies(),
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
      !isEqual(nextProps.location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeLoss({ ...location, ...settings });
    }
  }

  getSentence = () => {
    const { locationNames, indicators, settings, loss, extent } = this.props;
    const indicator = getActiveFilter(settings, indicators, 'indicator');
    const totalLoss =
      loss.length &&
      loss.reduce(
        (sum, item) => (typeof sum === 'object' ? sum.area : sum) + item.area
      );
    const totalEmissions =
      loss.length &&
      loss.reduce(
        (sum, item) =>
          (typeof sum === 'object' ? sum.emissions : sum) + item.emissions
      );
    const locationText = `${indicator &&
      indicator.label} of ${locationNames.current &&
      locationNames.current.label}`;

    return `Between ${settings.startYear} and ${
      settings.endYear
    }, ${locationText} lost ${numeral(totalLoss).format(
      '0,0'
    )} ha of tree cover: This loss is equal to ${numeral(
      totalLoss / (extent * 100)
    ).format('0.0')}% of the total ${indicator &&
      indicator.label.toLowerCase()} tree cover extent in 2010, and equivalent to ${numeral(
      totalEmissions
    ).format('0,0')} tonnes of CO\u2082 emissions.`;
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
  loss: PropTypes.array.isRequired,
  extent: PropTypes.number.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeLossContainer);
