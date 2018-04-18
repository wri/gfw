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
    const {
      getGladAlerts,
      location,
      settings,
      setGladAlertsSettings
    } = this.props;
    getGladAlerts({ ...location, ...settings });
    setGladAlertsSettings({
      layerStartDate: moment()
        .subtract(settings.weeks, 'weeks')
        .format('YYYY-MM-DD'),
      layerEndDate: moment().format('YYYY-MM-DD')
    });
  }

  componentWillUpdate(nextProps) {
    const {
      getGladAlerts,
      location,
      settings,
      setGladAlertsSettings
    } = nextProps;

    if (!isEqual(location, this.props.location)) {
      getGladAlerts({ ...location, ...settings });
    }
    if (settings.weeks !== this.props.settings.weeks) {
      setGladAlertsSettings({
        layerStartDate: moment()
          .subtract(settings.weeks, 'weeks')
          .format('YYYY-MM-DD'),
        layerEndDate: moment().format('YYYY-MM-DD')
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { settings } = nextProps;

    if (settings.layerStartDate !== this.props.settings.layerStartDate) {
      return false;
    }
    return true;
  }

  handleMouseMove = debounce(data => {
    let activeData = {};
    const {
      settings: { weeks },
      setActiveAlert,
      setGladAlertsSettings
    } = this.props;
    if (data) {
      const { activePayload } = data && data;
      activeData =
        activePayload && activePayload.find(d => d.name === 'count').payload;
    }
    setActiveAlert(activeData);
    setGladAlertsSettings({
      layerStartDate: activeData
        ? activeData.date
        : moment()
          .subtract(weeks, 'weeks')
          .format('YYYY-MM-DD'),
      layerEndDate: (activeData
        ? moment(activeData.date).add(1, 'week')
        : moment()
      ).format('YYYY-MM-DD')
    });
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
  setActiveAlert: PropTypes.func.isRequired,
  setGladAlertsSettings: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(WidgetGladAlertsContainer);
