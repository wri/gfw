import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { format } from 'd3-format';
import { getActiveFilter } from 'pages/country/widget/widget-selectors';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-fao-reforestation-actions';
import reducers, { initialState } from './widget-fao-reforestation-reducers';
import WidgetFAOReforestationComponent from './widget-fao-reforestation-component';
import {
  getFilteredData,
  getSentence
} from './widget-fao-reforestation-selectors';

const mapStateToProps = ({ widgetFAOReforestation, location }, ownProps) => {
  const { loading, data } = widgetFAOReforestation;
  return {
    loading: loading || ownProps.isMetaLoading,
    data: getFilteredData({
      data: data.countries,
      location: location.payload,
      colors: COLORS
    }),
    colors: COLORS
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
  data: PropTypes.array,
  options: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  getFAOReforestationData: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetFAOReforestationContainer
);
