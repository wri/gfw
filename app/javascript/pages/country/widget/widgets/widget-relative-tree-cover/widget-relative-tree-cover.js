import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-relative-tree-cover-actions';
import reducers, { initialState } from './widget-relative-tree-cover-reducers';
import {
  getSortedData,
  getSentence
} from './widget-relative-tree-cover-selectors';
import WidgetRelativeTreeCoverComponent from './widget-relative-tree-cover-component';

const mapStateToProps = (
  { location, widgetRelativeTreeCover, countryData },
  ownProps
) => {
  const { isCountriesLoading, isRegionsLoading } = countryData;
  const { settings, data, loading } = widgetRelativeTreeCover;
  const { settingsConfig, activeIndicator } = ownProps;
  const { payload } = location;
  const selectorData = {
    data: data.regions,
    settings,
    options: settingsConfig.options,
    meta: countryData[!payload.region ? 'regions' : 'subRegions'],
    location: payload,
    indicator: activeIndicator,
    locationNames: ownProps.locationNames,
    colors: COLORS.extent
  };

  return {
    regions: countryData.regions,
    loading: loading || isCountriesLoading || isRegionsLoading,
    data: getSortedData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetRelativeTreeCoverContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getRelativeTreeCover } = this.props;
    getRelativeTreeCover({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { settings, location, getRelativeTreeCover } = nextProps;

    if (
      !isEqual(location.country, this.props.location.country) ||
      !isEqual(location.region, this.props.location.region) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getRelativeTreeCover({
        ...location,
        ...settings
      });
    }
  }

  handlePageChange = change => {
    const { setRelativeTreeCoverPage, settings } = this.props;
    setRelativeTreeCoverPage(settings.page + change);
  };

  render() {
    return createElement(WidgetRelativeTreeCoverComponent, {
      ...this.props,
      handlePageChange: this.handlePageChange
    });
  }
}

WidgetRelativeTreeCoverContainer.propTypes = {
  setRelativeTreeCoverPage: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getRelativeTreeCover: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetRelativeTreeCoverContainer
);
