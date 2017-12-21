import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { format } from 'd3-format';
import {
  getPeriods,
  getActiveFilter
} from 'pages/country/widget/widget-selectors';

import WidgetTreeCoverGainComponent from './widget-fao-extent-component';
import actions from './widget-fao-extent-actions';

export { initialState } from './widget-fao-extent-reducers';
export { default as reducers } from './widget-fao-extent-reducers';
export { default as actions } from './widget-fao-extent-actions';

const mapStateToProps = ({ countryData, widgetFAOExtent, location }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  return {
    location: location.payload,
    isLoading:
      widgetFAOExtent.isLoading ||
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading,
    data: widgetFAOExtent.data,
    options: {
      periods: getPeriods() || []
    },
    settings: widgetFAOExtent.settings,
    config: widgetFAOExtent.config
  };
};

class WidgetFAOExtentContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getFAOExtentData } = this.props;
    getFAOExtentData({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getFAOExtentData } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.period, this.props.settings.period)
    ) {
      getFAOExtentData({
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
    return createElement(WidgetTreeCoverGainComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetFAOExtentContainer.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  getFAOExtentData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetFAOExtentContainer);
