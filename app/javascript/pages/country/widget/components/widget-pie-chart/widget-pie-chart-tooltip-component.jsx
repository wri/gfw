import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

class WidgetPieChartTooltip extends PureComponent {
  render() {
    const { data } = this.props;
    const payload = data && data.length && data[0].payload;
    return payload ? <div>{format('.1f')(payload.percentage)}%</div> : null;
  }
}

WidgetPieChartTooltip.propTypes = {
  data: PropTypes.array
};

export default WidgetPieChartTooltip;
