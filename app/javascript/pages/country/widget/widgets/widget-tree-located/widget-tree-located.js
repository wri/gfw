import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
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
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getTreeLocated({
        ...location,
        ...settings
      });
    }
  }

  // getSentence = () => {
  //   const { locationNames, settings } = this.props;
  //   const { indicators } = this.props.options;
  //   const { totalArea, cover } = this.props.data;
  //   const indicator = getLocationLabel(settings.indicator, indicators);
  //   const coverStatus = cover / totalArea > 0.5 ? 'tree covered' : 'non-forest';
  //   const first = `<b>${
  //     locationNames.current.label
  //   } (${indicator})</b> is mainly ${coverStatus}, `;
  //   const second = `considering tree cover extent in <b>${
  //     settings.extentYear
  //   }</b> where tree canopy is greater than <b>${settings.threshold}%</b>`;

  //   return `${first} ${second}`;
  // };

  handlePageChange = change => {
    const { setTreeLocatedPage, settings } = this.props;
    setTreeLocatedPage(settings.page + change);
  };

  render() {
    return createElement(WidgetTreeLocatedComponent, {
      ...this.props,
      handlePageChange: this.handlePageChange
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
