import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-emissions-deforestation-actions';
import reducers, {
  initialState
} from './widget-emissions-deforestation-reducers';
import {
  getChartData,
  chartConfig,
  getSentence
} from './widget-emissions-deforestation-selectors';
import WidgetEmissionsDeforestationComponent from './widget-emissions-deforestation-component';

const mapStateToProps = ({ widgetEmissionsDeforestation }, ownProps) => {
  const { settings, data } = widgetEmissionsDeforestation;
  const { locationNames } = ownProps;
  const selectorData = {
    data,
    settings,
    locationNames,
    colors: COLORS.emissions
  };
  return {
    chartData: getChartData(selectorData),
    chartConfig: chartConfig(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetEmissionsDeforestationContainer extends PureComponent {
  componentWillMount() {
    const { location, getEmissionsDeforestationData } = this.props;
    getEmissionsDeforestationData({ ...location });
  }

  componentWillReceiveProps(nextProps) {
    const { location, getEmissionsDeforestationData } = nextProps;

    if (!isEqual(location.country, this.props.location.country)) {
      getEmissionsDeforestationData({ ...location });
    }
  }

  render() {
    return createElement(WidgetEmissionsDeforestationComponent, {
      ...this.props
    });
  }
}

WidgetEmissionsDeforestationContainer.propTypes = {
  location: PropTypes.object.isRequired,
  getEmissionsDeforestationData: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetEmissionsDeforestationContainer
);
