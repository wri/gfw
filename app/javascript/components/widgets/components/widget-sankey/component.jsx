import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Sankey from 'components/charts/sankey-chart/sankey';

import './styles';

class WidgetTreeCover extends PureComponent {
  render() {
    const { data } = this.props;

    const config = {
      tooltip: {
        scale: 1 / 1000,
        suffix: 'm',
        unit: 'tpu'
      },
      node: {
        scale: 1 / 1000,
        suffix: 'node'
      }
    };

    return (
      <div className="c-sankey-chart-legend-widget">
        <Sankey
          data={data}
          config={config}
          tooltipChildren={node =>
            node.payload &&
            node.payload.payload && (
              <div>
                {node.payload.payload.abs_pct} percentage of land went to{' '}
                {node.payload.payload.target &&
                  node.payload.payload.target.name}
              </div>
            )
          }
        />
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  data: PropTypes.array
  // settings: PropTypes.object.isRequired
};

export default WidgetTreeCover;
