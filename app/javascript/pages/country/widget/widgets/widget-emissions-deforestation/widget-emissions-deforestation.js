import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import actions from './widget-emissions-deforestation-actions';
import reducers, {
  initialState
} from './widget-emissions-deforestation-reducers';
import {
  chartData,
  chartConfig,
  getSentence
} from './widget-emissions-deforestation-selectors';
import WidgetEmissionsDeforestationComponent from './widget-emissions-deforestation-component';

const mapStateToProps = ({ widgetEmissionsDeforestation }, ownProps) => {
  const { settings, data } = widgetEmissionsDeforestation;
  const { activeIndicator, colors } = ownProps;
  const selectorData = {
    data: data.loss,
    settings,
    indicator: activeIndicator,
    colors
  };
  return {
    chartData: chartData(selectorData),
    chartConfig: chartConfig(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetEmissionsDeforestationContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getEmissionsDeforestationData } = this.props;
    getEmissionsDeforestationData({ ...location, ...settings });
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getEmissionsDeforestationData } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear)
    ) {
      getEmissionsDeforestationData({ ...location, ...settings });
    }
  }

  render() {
    return createElement(WidgetEmissionsDeforestationComponent, {
      ...this.props
    });
  }
}

WidgetEmissionsDeforestationContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getEmissionsDeforestationData: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  WidgetEmissionsDeforestationContainer
);
