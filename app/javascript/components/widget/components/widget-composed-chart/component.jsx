import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import ComposedChart from 'components/charts/composed-chart';

class WidgetComposedChart extends Component {
  static propTypes = {
    data: PropTypes.array,
    config: PropTypes.object,
    handleMouseMove: PropTypes.func,
    handleMouseOut: PropTypes.func,
    parsePayload: PropTypes.func,
    active: PropTypes.bool,
    simple: PropTypes.bool
  };

  handleMouseMove = debounce(data => {
    const { parsePayload, handleMouseMove } = this.props;
    if (parsePayload && handleMouseMove) {
      const { activePayload } = data && data;
      const activeData = parsePayload(activePayload);
      handleMouseMove(activeData);
    }
  }, 100);

  handleMouseLeave = debounce(() => {
    const { handleMouseOut } = this.props;
    if (handleMouseOut) {
      handleMouseOut();
    }
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

export default WidgetComposedChart;
