import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { format } from 'd3-format';
import {
  getPeriods,
  getActiveFilter
} from 'pages/country/widget/widget-selectors';

import WidgetFAOReforestationComponent from './widget-fao-reforestation-component';
import actions from './widget-fao-reforestation-actions';

export { initialState } from './widget-fao-reforestation-reducers';
export { default as reducers } from './widget-fao-reforestation-reducers';
export { default as actions } from './widget-fao-reforestation-actions';

const mapStateToProps = ({ countryData, widgetFAOReforestation, location }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  return {
    title: widgetFAOReforestation.title,
    anchorLink: widgetFAOReforestation.anchorLink,
    location: location.payload,
    isLoading:
      widgetFAOReforestation.isLoading ||
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading,
    data: widgetFAOReforestation.data,
    options: {
      periods: getPeriods() || []
    },
    settings: widgetFAOReforestation.settings,
    config: widgetFAOReforestation.config
  };
};

class WidgetFAOReforestationContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getFAOReforestationData } = this.props;
    getFAOReforestationData({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getFAOReforestationData } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.period, this.props.settings.period)
    ) {
      getFAOReforestationData({
        ...location,
        ...settings
      });
    }
  }

  getSentence = () => {
    const { data, settings } = this.props;
    const { periods } = this.props.options;
    const period = getActiveFilter(settings, periods, 'period');
    const sentence = `From <strong>${period &&
      period.label}</strong>, the rate of reforestation in <strong>${
      data.name
    }</strong> was <strong>${format(',')(data.rate * 1000)} ha/year</strong>.`;
    return sentence;
  };

  render() {
    return createElement(WidgetFAOReforestationComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetFAOReforestationContainer.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  getFAOReforestationData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(
  WidgetFAOReforestationContainer
);
