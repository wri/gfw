import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import { setWidgetSettingsUrl } from 'pages/country/widget/widget-actions';

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
import ownActions from './widget-tree-loss-actions';

const actions = { setWidgetSettingsUrl, ...ownActions };

export { initialState } from './widget-tree-loss-reducers';
export { default as reducers } from './widget-tree-loss-reducers';
export { default as actions } from './widget-tree-loss-actions';

const mapStateToProps = ({ widgetTreeLoss, location, countryData }) => ({
  title: widgetTreeLoss.title,
  anchorLink: widgetTreeLoss.anchorLink,
  loading: widgetTreeLoss.loading,
  location: location.payload,
  data:
    filterData({
      data: widgetTreeLoss.data,
      ...widgetTreeLoss.settings
    }) || [],
  extent: widgetTreeLoss.data.extent,
  options: {
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
        whitelist: widgetTreeLoss.config.indicators,
        location: location.payload,
        ...countryData
      }) || [],
    thresholds: getThresholds()
  },
  settings: widgetTreeLoss.settings,
  config: widgetTreeLoss.config,
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
    const { locationNames, settings, data, extent } = this.props;
    const { indicators } = this.props.options;
    const indicator = getActiveFilter(settings, indicators, 'indicator');
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && sumBy(data, 'emissions')) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;
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
    )}ha</b> of tree cover${totalLoss ? '.' : ','} ${
      totalLoss > 0
        ? ` 
      This loss is equal to <b>${format('.1f')(
          percentageLoss
        )}%</b> of the regions tree cover extent in 2010, 
      and equivalent to <b>${format('.3s')(
          totalEmissions
        )}tonnes</b> of CO\u2082 emissions`
        : ''
    }
     with canopy density <span>> ${settings.threshold}%</span>.`;
  };

  render() {
    return createElement(WidgetTreeLossComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeLossContainer.propTypes = {
  locationNames: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeLoss: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  extent: PropTypes.number.isRequired
};

export default connect(mapStateToProps, actions)(WidgetTreeLossContainer);
