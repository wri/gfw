import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

class WidgetTreeCoverTooltip extends PureComponent {
  render() {
    const { data } = this.props;
    const payload = data && data.length && data[0].payload;
    return payload ? (
      <div>
        <p>{payload.name}</p>
        <span>{format('.3s')(payload.percentage)}%</span>
      </div>
    ) : null;
  }
}

WidgetTreeCoverTooltip.propTypes = {
  data: PropTypes.array
};

export default WidgetTreeCoverTooltip;
