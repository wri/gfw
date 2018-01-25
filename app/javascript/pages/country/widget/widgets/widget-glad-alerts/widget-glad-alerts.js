import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import COLORS from 'pages/country/data/colors.json';

import actions from './widget-glad-alerts-actions';
import reducers, { initialState } from './widget-glad-alerts-reducers';
import {
  getData,
  chartConfig,
  getSentence
} from './widget-glad-alerts-selectors';
import WidgetGladAlertsComponent from './widget-glad-alerts-component';

const mapStateToProps = ({ widgetGladAlerts }, ownProps) => {
  const { locationNames, activeIndicator } = ownProps;
  const { data, settings } = widgetGladAlerts;
  const selectorData = {
    alerts: data.alerts,
    period: data.period,
    settings,
    locationNames,
    activeIndicator,
    colors: COLORS.loss
  };
  return {
    data: getData(selectorData),
    config: chartConfig(selectorData)
    // sentence: getSentence(selectorData)
  };
};

class WidgetGladAlertsContainer extends PureComponent {
  componentWillMount() {
    const { getGladAlerts, location, settings } = this.props;
    getGladAlerts({ ...location, ...settings });
  }

  componentWillUpdate(nextProps) {
    const { getGladAlerts, location, settings } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.indicator, this.props.settings.indicator) ||
      !isEqual(settings.extentYear, this.props.settings.extentYear) ||
      !isEqual(settings.threshold, this.props.settings.threshold)
    ) {
      getGladAlerts({ ...location, ...settings });
    }
  }

  render() {
    return createElement(WidgetGladAlertsComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetGladAlertsContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getGladAlerts: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetGladAlertsContainer);
