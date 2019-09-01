import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import ComposedChart from 'components/charts/composed-chart';

class WidgetComposedChart extends Component {
  static propTypes = {
    data: PropTypes.array,
    config: PropTypes.object,
    handleChangeSettings: PropTypes.func,
    parseInteraction: PropTypes.func,
    active: PropTypes.bool,
    simple: PropTypes.bool
  };

  handleMouseMove = debounce(data => {
    const { parseInteraction, handleChangeSettings } = this.props;
    if (parseInteraction && handleChangeSettings) {
      const { activePayload } = data && data;
      if (activePayload && activePayload.length) {
        const interaction = parseInteraction(activePayload[0].payload);
        handleChangeSettings({ interaction });
      }
    }
  }, 100);

  handleMouseLeave = debounce(() => {
    const { handleChangeSettings } = this.props;
    if (handleChangeSettings) {
      handleChangeSettings({ interaction: {} });
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
