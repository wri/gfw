import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

// import { Sankey } from 'cw-components';
import Sankey from 'components/charts/sankey-chart/sankey';

import './styles';

class WidgetTreeCover extends PureComponent {
  render() {
    // const { data, settings, simple } = this.props;
    // console.log('component data:', data);

    const testData = {
      nodes: [
        {
          name: 'Forest',
          color: '#00955f'
        },
        {
          name: 'Forest',
          color: '#00955f'
        },
        {
          name: 'Wetlands',
          color: '#FFB400'
        },
        {
          name: 'Wetlands',
          color: '#FFB400'
        },
        {
          name: 'Grassland',
          color: '#3498db'
        },
        {
          name: 'Grassland',
          color: '#3498db'
        },
        {
          name: 'Cropland',
          color: '#ab0000'
        },
        {
          name: 'Cropland',
          color: '#ab0000'
        },
        {
          name: 'Bare',
          color: '#00955f'
        },
        {
          name: 'Bare',
          color: '#00955f'
        },
        {
          name: 'Settlement',
          color: '#FFB400'
        },
        {
          name: 'Settlement',
          color: '#FFB400'
        }
      ],
      links: [
        { source: 0, target: 3, value: 5000, timeframes: '2001-2011' },
        { source: 0, target: 5, value: 7000, timeframes: '2001-2011' },
        { source: 2, target: 7, value: 2400, timeframes: '2001-2011' },
        { source: 2, target: 5, value: 1400, timeframes: '2001-2011' },
        { source: 6, target: 3, value: 7400, timeframes: '2001-2011' },
        { source: 4, target: 3, value: 3700, timeframes: '2001-2011' },
        { source: 4, target: 7, value: 1200, timeframes: '2001-2011' }
      ]
    };

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
      <div className="c-pie-chart-legend-widget">
        <Sankey
          data={testData}
          config={config}
          tooltipChildren={() => (
            // tooltipChildren={node => (
            <div>Tooltip Extra Info: extra info here</div>
          )}
        />
      </div>
    );
  }
}

/*
WidgetTreeCover.propTypes = {
  data: PropTypes.array
  // simple: PropTypes.bool,
  // settings: PropTypes.object.isRequired
};
*/

export default WidgetTreeCover;
