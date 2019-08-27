import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SankeyChart from 'components/charts/sankey-chart/sankey';

import './styles';

class WidgetSankey extends PureComponent {
  render() {
    const { data, settings } = this.props;
    const { unit, startYear, endYear } = settings;

    const config = {
      tooltip: {
        scale: 1 / 1000,
        unit: unit || 'ha'
      },
      node: {
        scale: 1 / 1000,
        suffix: 'node'
      },
      nodeTitles: [startYear, endYear]
    };

    return (
      <div className="c-sankey-chart-widget">
        <SankeyChart
          data={data}
          config={config}
          height={300}
          nodeWidth={50}
          margin={{ top: 10, left: 50, right: 50, bottom: 50 }}
        />
      </div>
    );
  }
}

WidgetSankey.propTypes = {
  data: PropTypes.object,
  settings: PropTypes.object
};

export default WidgetSankey;
