import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import actions from './widget-glad-alerts-actions';
import reducers, { initialState } from './widget-glad-alerts-reducers';
import {
  chartData,
  chartConfig,
  getSentence
} from './widget-glad-alerts-selectors';
import WidgetGladAlertsComponent from './widget-glad-alerts-component';

const mapStateToProps = ({ widgetGladAlerts }, ownProps) => {
  const { data, settings, activeAlert } = widgetGladAlerts;
  const { colors } = ownProps;
  const selectorData = {
    ...data,
    settings,
    colors,
    activeData: activeAlert
  };
  return {
    data: chartData(selectorData),
    config: chartConfig(selectorData),
    sentence: getSentence(selectorData)
  };
};

class WidgetGladAlertsContainer extends PureComponent {
  componentWillMount() {
    const { getGladAlerts, location, settings } = this.props;
    getGladAlerts({ ...location, ...settings });
  }

  componentWillUpdate(nextProps) {
    const { getGladAlerts, location, settings } = nextProps;

    if (!isEqual(location, this.props.location)) {
      getGladAlerts({ ...location, ...settings });
    }
  }

  handleMouseMove = debounce(data => {
    let activeData = {};
    const { setActiveAlert } = this.props;
    if (data) {
      const { activePayload } = data && data;
      activeData =
        activePayload && activePayload.find(d => d.name === 'count').payload;
    }
    setActiveAlert(activeData);
  }, 100);

  render() {
    return createElement(WidgetGladAlertsComponent, {
      ...this.props,
      getSentence: this.getSentence,
      handleMouseMove: this.handleMouseMove
    });
  }
}

WidgetGladAlertsContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getGladAlerts: PropTypes.func.isRequired,
  setActiveAlert: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetGladAlertsContainer);
