import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import ComposedChart from 'components/charts/composed-chart';

class WidgetComposedChart extends Component {
  shouldComponentUpdate = nextProps =>
    (!isEqual(nextProps.settings, this.props.settings) &&
      isEqual(nextProps.settings.activeData, this.props.settings.activeData)) ||
    !isEqual(nextProps.data, this.props.data) ||
    !isEqual(nextProps.config, this.props.config);

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
    const { className, data, config, active, simple, handleClick } = this.props;

    return (
      <ComposedChart
        className={className}
        data={data}
        config={config}
        handleMouseMove={this.handleMouseMove}
        handleMouseLeave={this.handleMouseLeave}
        handleClick={handleClick}
        backgroundColor={active ? '#fefedc' : ''}
        simple={simple}
      />
    );
  }
}

WidgetComposedChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  config: PropTypes.object,
  settings: PropTypes.object,
  setWidgetsSettings: PropTypes.func,
  parsePayload: PropTypes.func,
  widget: PropTypes.string,
  active: PropTypes.bool,
  simple: PropTypes.bool,
  layers: PropTypes.array,
  handleClick: PropTypes.func
};

export default WidgetComposedChart;
