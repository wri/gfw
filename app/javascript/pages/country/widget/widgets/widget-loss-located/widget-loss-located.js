import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-loss-located-actions';
import reducers, { initialState } from './widget-loss-located-reducers';
import {
  getSortedData,
  getChartData,
  getSentence
} from './widget-loss-located-selectors';
import WidgetLossLocatedComponent from './widget-loss-located-component';

const mapStateToProps = (
  { location, widgetLossLocated, countryData },
  ownProps
) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const { settings, data, loading } = widgetLossLocated;
  const { colors, locationNames, settingsConfig, activeIndicator } = ownProps;
  const { payload } = location;
  const selectorData = {
    data: data.regions,
    settings,
    options: settingsConfig.options,
    meta: countryData[!payload.region ? 'regions' : 'subRegions'],
    location: payload,
    colors,
    indicator: activeIndicator,
    locationNames
  };
  return {
    regions: countryData.regions,
    loading: loading || isCountriesLoading || isRegionsLoading,
    data: getSortedData(selectorData),
    chartData: getChartData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetLossLocatedContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getLossLocated } = this.props;
    getLossLocated({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getLossLocated } = nextProps;

    if (
      !isEqual(location.country, this.props.location.country) ||
      !isEqual(location.region, this.props.location.region) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getLossLocated({
        ...location,
        ...settings
      });
    }
  }

  handlePageChange = change => {
    const { setLossLocatedPage, settings } = this.props;
    setLossLocatedPage(settings.page + change);
  };

  render() {
    return createElement(WidgetLossLocatedComponent, {
      ...this.props,
      handlePageChange: this.handlePageChange
    });
  }
}

WidgetLossLocatedContainer.propTypes = {
  setLossLocatedPage: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getLossLocated: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetLossLocatedContainer);
