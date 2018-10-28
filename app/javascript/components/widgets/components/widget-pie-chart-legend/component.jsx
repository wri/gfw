import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import PieChart from 'components/charts/pie-chart';
import PieChartLegend from 'components/charts/components/pie-chart-legend';

import './styles';

class WidgetTreeCover extends PureComponent {
  render() {
    const { data, settings, simple } = this.props;

    return (
      <div className="c-pie-chart-legend-widget">
        <PieChartLegend
          className="cover-legend"
          data={data}
          config={{
            format: '.3s',
            unit: 'ha',
            key: 'value',
            ...settings
          }}
          simple={simple}
        />
        <PieChart
          className="cover-pie-chart"
          data={data}
          maxSize={140}
          tooltip={[
            {
              key: 'percentage',
              unit: '%',
              labelKey: 'label',
              unitFormat: value => format('.1f')(value)
            }
          ]}
          simple={simple}
        />
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  data: PropTypes.array,
  simple: PropTypes.bool,
  settings: PropTypes.object.isRequired
};

export default WidgetTreeCover;
