import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-glad-ranked-actions';
import reducers, { initialState } from './widget-glad-ranked-reducers';
import { getSortedData, getSentence } from './widget-glad-ranked-selectors';
import WidgetGladRankedComponent from './widget-glad-ranked-component';

const mapStateToProps = (
  { location, widgetGladRanked, countryData },
  ownProps
) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const { settings, data, loading } = widgetGladRanked;
  const { colors, locationNames, settingsConfig, activeIndicator } = ownProps;
  const { payload } = location;
  const selectorData = {
    ...data,
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

class WidgetGladRankedContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getGladRanked } = this.props;
    getGladRanked({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getGladRanked } = nextProps;

    if (
      !isEqual(location.country, this.props.location.country) ||
      !isEqual(location.region, this.props.location.region) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.threshold, this.props.settings.threshold) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear)
    ) {
      getGladRanked({
        ...location,
        ...settings
      });
    }
  }

  handlePageChange = change => {
    const { setGladRankedPage, settings } = this.props;
    setGladRankedPage(settings.page + change);
  };

  render() {
    return createElement(WidgetGladRankedComponent, {
      ...this.props,
      handlePageChange: this.handlePageChange
    });
  }
}

WidgetGladRankedContainer.propTypes = {
  setGladRankedPage: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getGladRanked: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetGladRankedContainer);
