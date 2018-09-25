import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import ComposedChart from 'components/charts/composed-chart';

class WidgetAlerts extends Component {
  shouldComponentUpdate = nextProps =>
    nextProps.settings.weeks !== this.props.settings.weeks ||
    nextProps.data !== this.props.data ||
    nextProps.settings.dataset !== this.props.settings.dataset;

  handleMouseMove = debounce(data => {
    const { parsePayload, setWidgetSettings, widget } = this.props;
    if (parsePayload) {
      const { activePayload } = data && data;
      const activeData = parsePayload(activePayload);
      setWidgetSettings({ widget, value: { activeData } });
    }
  }, 100);

  handleMouseLeave = debounce(() => {
    const { setWidgetSettings, widget } = this.props;
    setWidgetSettings({ widget, value: { activeData: {} } });
  }, 100);

  render() {
    const { data, config, active, simple } = this.props;

    return (
      <div className="c-widget-composed-chart">
        <ComposedChart
          className="loss-chart"
          data={data}
          config={config}
          handleMouseMove={this.handleMouseMove}
          handleMouseLeave={this.handleMouseLeave}
          backgroundColor={active ? '#fefedc' : ''}
          simple={simple}
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
  parsePayload: PropTypes.func,
  widget: PropTypes.string,
  active: PropTypes.bool,
  simple: PropTypes.bool
};

export default WidgetAlerts;
