import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SankeyChart from 'components/charts/sankey-chart/sankey';

import './styles';

class WidgetTreeCover extends PureComponent {
  render() {
    const { data } = this.props;

    const config = {
      tooltip: {
        scale: 1 / 1000,
        suffix: 'm'
        // unit: 'tpu'
      },
      node: {
        scale: 1 / 1000,
        suffix: 'node'
      }
    };

    return (
      <div className="c-sankey-chart-widget">
        <SankeyChart data={data} config={config} height={400} />
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  data: PropTypes.array
  // settings: PropTypes.object.isRequired
};

export default WidgetTreeCover;
