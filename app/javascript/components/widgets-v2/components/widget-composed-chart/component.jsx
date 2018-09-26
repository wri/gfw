import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import ComposedChart from 'components/charts/composed-chart';

class WidgetAlerts extends Component {
  shouldComponentUpdate = nextProps =>
    !isEqual(nextProps.settings.weeks, this.props.settings.weeks) ||
    !isEqual(nextProps.data, this.props.data) ||
    !isEqual(nextProps.settings.dataset, this.props.settings.dataset);

  handleMouseMove = debounce(data => {
    const { parsePayload, setWidgetsSettings, widget, layers } = this.props;
    if (parsePayload) {
      const { activePayload } = data && data;
      const activeData = parsePayload(activePayload);
      setWidgetsSettings({ widget, data: { ...activeData, layers } });
    }
  }, 100);

  handleMouseLeave = debounce(() => {
    const { setWidgetsSettings, widget } = this.props;
    setWidgetsSettings({ widget, data: {} });
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
  setWidgetsSettings: PropTypes.func,
  parsePayload: PropTypes.func,
  widget: PropTypes.string,
  active: PropTypes.bool,
  simple: PropTypes.bool,
  layers: PropTypes.array
};

export default WidgetAlerts;
