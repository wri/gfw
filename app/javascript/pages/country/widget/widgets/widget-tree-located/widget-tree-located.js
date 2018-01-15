import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';
import { getLocationLabel } from 'pages/country/widget/widget-selectors';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-tree-located-actions';
import reducers, { initialState } from './widget-tree-located-reducers';
import { getSortedData, getChartData } from './widget-tree-located-selectors';
import WidgetTreeLocatedComponent from './widget-tree-located-component';

const mapStateToProps = ({ location, widgetTreeLocated, countryData }) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const data = {
    data: widgetTreeLocated.data.regions,
    unit: widgetTreeLocated.settings.unit,
    meta: countryData[!location.payload.region ? 'regions' : 'subRegions'],
    location: location.payload,
    colors: COLORS
  };
  return {
    regions: countryData.regions,
    loading:
      widgetTreeLocated.loading || isCountriesLoading || isRegionsLoading,
    data: getSortedData(data) || [],
    chartData: getChartData(data)
  };
};

class WidgetTreeLocatedContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getTreeLocated } = this.props;
    getTreeLocated({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getTreeLocated } = nextProps;

    if (
      !isEqual(location.country, this.props.location.country) ||
      !isEqual(location.region, this.props.location.region) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeLocated({
        ...location,
        ...settings
      });
    }
  }

  getSentence = () => {
    // The top 11 sub-regions are responsible for 49% of England's regional tree cover 
    // in 2000 where tree canopy is greater than 0%. North Yorkshire has 
    // the largest relative tree cover in England, at 8% compared to an average of 0.9%.

    const { data, settings, options, location, locationNames } = this.props;
    const { extentYear, indicator, threshold } = this.props.settings;
    const { indicators } = this.props.options;

    const totalExtent = sumBy(data, 'extent');
    const currentLocation = locationNames && locationNames.current && locationNames.current.label;
    const locationLabel = getLocationLabel(currentLocation, indicator, indicators);
    const topRegion = data.length && data[0];
    console.log(totalExtent, data.length);
    const avgExtent = totalExtent / data.length;
    let percentileExtent = 0;
    let percentileLength = 0;
    let first = '';
    let second = '';

    if (data.length > 10) {
      while (percentileLength < data.length && percentileExtent / totalExtent < 0.5) {
        percentileExtent += data[percentileLength].extent;
        percentileLength += 1;
      }
      const topExtent = percentileExtent / totalExtent * 100;
      first = `The top <b>${percentileLength}</b> regions are responsible for more than half <b>(${format('.0f')(topExtent)}%)</b> of <b>${locationLabel}'s</b> regional tree cover in <b>${extentYear}</b> where tree canopy is greater than <b>${threshold}%</b>.`;
    }

    second = `${!first ? `Within <b>${currentLocation}</b>,` : ''}<b> ${topRegion.label}</b> has the largest relative tree cover in ${currentLocation}, at <b>${format('.0f')(topRegion.percentage)}%</b> compared to an average of <b>${format('.0f')(avgExtent)}%</b>`;

    return `${first} ${second}`;
  };

  handlePageChange = change => {
    const { setTreeLocatedPage, settings } = this.props;
    setTreeLocatedPage(settings.page + change);
  };

  render() {
    return createElement(WidgetTreeLocatedComponent, {
      ...this.props,
      handlePageChange: this.handlePageChange,
      getSentence: this.getSentence
    });
  }
}

WidgetTreeLocatedContainer.propTypes = {
  setTreeLocatedPage: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTreeLocated: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetTreeLocatedContainer);
