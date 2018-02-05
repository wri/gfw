import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-gain-located-actions';
import reducers, { initialState } from './widget-gain-located-reducers';
import {
  getSortedData,
  getChartData,
  getSentence
} from './widget-gain-located-selectors';
import WidgetGainLocatedComponent from './widget-gain-located-component';

const mapStateToProps = (
  { location, widgetGainLocated, countryData },
  ownProps
) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const { settings, data, loading } = widgetGainLocated;
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

class WidgetGainLocatedContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getGainLocated } = this.props;
    getGainLocated({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getGainLocated } = nextProps;

    if (
      !isEqual(location.country, this.props.location.country) ||
      !isEqual(location.region, this.props.location.region) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getGainLocated({
        ...location,
        ...settings
      });
    }
  }

  handlePageChange = change => {
    const { setGainLocatedPage, settings } = this.props;
    setGainLocatedPage(settings.page + change);
  };

  render() {
    return createElement(WidgetGainLocatedComponent, {
      ...this.props,
      handlePageChange: this.handlePageChange
    });
  }
}

WidgetGainLocatedContainer.propTypes = {
  setGainLocatedPage: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getGainLocated: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetGainLocatedContainer);
