import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-emissions-actions';
import reducers, { initialState } from './widget-emissions-reducers';
import { getSentence, getChartData } from './widget-emissions-selectors';
import WidgetEmissionsComponent from './widget-emissions-component';

const mapStateToProps = ({ location, widgetEmissions }) => {
  const { settings, data } = widgetEmissions;
  const { payload } = location;
  const selectorData = {
    data,
    settings,
    location: payload,
    colors: COLORS.extent
  };
  return {
    chartData: getChartData(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetEmissionsContainer extends PureComponent {
  componentWillMount() {
    const { location, getEmissionsData } = this.props;
    getEmissionsData({ ...location });
  }

  componentWillReceiveProps(nextProps) {
    const { location, getEmissionsData } = nextProps;

    if (!isEqual(location.country, this.props.location.country)) {
      getEmissionsData({ ...location });
    }
  }

  render() {
    return createElement(WidgetEmissionsComponent, {
      ...this.props
    });
  }
}

WidgetEmissionsContainer.propTypes = {
  location: PropTypes.object.isRequired,
  getEmissionsData: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetEmissionsContainer);
