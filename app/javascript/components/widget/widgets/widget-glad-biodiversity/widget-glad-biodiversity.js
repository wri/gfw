import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-glad-biodiversity-actions';
import reducers, { initialState } from './widget-glad-biodiversity-reducers';
import {
  getSortedData,
  getSentence
} from './widget-glad-biodiversity-selectors';
import WidgetGladBiodiversityComponent from './widget-glad-biodiversity-component';

const mapStateToProps = (
  { location, widgetGladBiodiversity, countryData },
  ownProps
) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const { settings, data, loading } = widgetGladBiodiversity;
  const { colors, locationNames, settingsConfig, activeIndicator } = ownProps;
  const { payload } = location;
  const selectorData = {
    data: data.data,
    extent: data.extent,
    latest: data.latest,
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
    sentence: getSentence(selectorData)
  };
};

class WidgetGladBiodiversityContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getGladBiodiversity } = this.props;
    getGladBiodiversity({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getGladBiodiversity } = nextProps;

    if (
      !isEqual(location.country, this.props.location.country) ||
      !isEqual(location.region, this.props.location.region) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear)
    ) {
      getGladBiodiversity({
        ...location,
        ...settings
      });
    }
  }

  handlePageChange = change => {
    const { setGladBiodiversityPage, settings } = this.props;
    setGladBiodiversityPage(settings.page + change);
  };

  render() {
    return createElement(WidgetGladBiodiversityComponent, {
      ...this.props,
      handlePageChange: this.handlePageChange
    });
  }
}

WidgetGladBiodiversityContainer.propTypes = {
  setGladBiodiversityPage: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getGladBiodiversity: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetGladBiodiversityContainer
);
