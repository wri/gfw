import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import ComposedChart from 'components/charts/composed-chart';

class WidgetAlerts extends Component {
  handleMouseMove = debounce(data => {
    const { parsePayload, handleMouseMove } = this.props;
    if (parsePayload) {
      const { activePayload } = data && data;
      const activeData = parsePayload(activePayload);
      handleMouseMove(activeData);
    }
  }, 100);

  handleMouseLeave = debounce(() => {
    const { handleMouseOut } = this.props;
    handleMouseOut();
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
  handleMouseMove: PropTypes.func,
  handleMouseOut: PropTypes.func,
  parsePayload: PropTypes.func,
  active: PropTypes.bool,
  simple: PropTypes.bool
};

export default WidgetAlerts;
