import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
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
  const { data, settings } = widgetGladAlerts;
  const { colors } = ownProps;
  const selectorData = {
    ...data,
    settings,
    colors,
    activeData: settings.activeData
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

  componentWillReceiveProps(nextProps) {
    const { getGladAlerts, location, settings } = nextProps;

    if (!isEqual(location, this.props.location)) {
      getGladAlerts({ ...location, ...settings });
    }
  }

  handleMouseMove = debounce(data => {
    const { setGladAlertsSettings } = this.props;
    let activeData = {};
    if (data) {
      const { activePayload } = data && data;
      const payload =
        activePayload && activePayload.find(d => d.name === 'count').payload;
      const startDate =
        payload &&
        moment()
          .year(payload.year)
          .week(payload.week);
      if (payload) {
        activeData = {
          ...payload,
          startDate,
          endDate: startDate && startDate.add(7, 'days')
        };
      }
    }
    setGladAlertsSettings({ activeData });
  }, 100);

  handleMouseLeave = debounce(() => {
    const { setGladAlertsSettings } = this.props;
    setGladAlertsSettings({ activeData: {} });
  }, 100);

  render() {
    return createElement(WidgetGladAlertsComponent, {
      ...this.props,
      getSentence: this.getSentence,
      handleMouseMove: this.handleMouseMove,
      handleMouseLeave: this.handleMouseLeave
    });
  }
}

WidgetGladAlertsContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getGladAlerts: PropTypes.func.isRequired,
  setGladAlertsSettings: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetGladAlertsContainer);
