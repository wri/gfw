import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import debounce from 'lodash/debounce';

import ComposedChart from 'components/charts/composed-chart';

class WidgetAlerts extends Component {
  shouldComponentUpdate = nextProps =>
    nextProps.settings.weeks !== this.props.settings.weeks ||
    nextProps.data !== this.props.data ||
    nextProps.settings.dataset !== this.props.settings.dataset;

  handleMouseMove = debounce(data => {
    const { setWidgetSettings, widget } = this.props;
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
    setWidgetSettings({ widget, settings: { activeData } });
  }, 100);

  handleMouseLeave = debounce(() => {
    const { setWidgetSettings, widget } = this.props;
    setWidgetSettings({ widget, settings: { activeData: {} } });
  }, 100);

  render() {
    const { data, config, active } = this.props;

    return (
      <div className="c-widget-glad-alerts">
        <ComposedChart
          className="loss-chart"
          data={data}
          config={config}
          handleMouseMove={this.handleMouseMove}
          handleMouseLeave={this.handleMouseLeave}
          backgroundColor={active ? '#fefedc' : ''}
        />
      </div>
    );
  }
}

WidgetAlerts.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  settings: PropTypes.object,
  setWidgetSettings: PropTypes.func,
  widget: PropTypes.string,
  active: PropTypes.bool
};

export default WidgetAlerts;
