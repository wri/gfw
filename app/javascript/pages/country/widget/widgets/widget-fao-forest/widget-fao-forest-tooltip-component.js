import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

class WidgetFAOForestTooltip extends PureComponent {
  render() {
    const { data } = this.props;

    return data && data.length > 0 ? (
      <ul>
        <li>{numeral(data[0].payload.value / 10000000).format('0.0')}%</li>
      </ul>
    ) : null;
  }
}

WidgetFAOForestTooltip.propTypes = {
  data: PropTypes.array
};

export default WidgetFAOForestTooltip;
