import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PieChart from 'components/charts/pie-chart';
import PieChartLegend from 'components/charts/components/pie-chart-legend';

import './pie-chart-legend-styles';

class WidgetTreeCover extends PureComponent {
  render() {
    const { data, settings } = this.props;

    return (
      <div className="c-pie-chart-legend-widget">
        <PieChartLegend
          className="cover-legend"
          data={data}
          config={{
            ...settings,
            format: '.3s',
            unit: 'ha',
            key: 'value'
          }}
        />
        <PieChart
          className="cover-pie-chart"
          data={data}
          maxSize={140}
        />
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  data: PropTypes.array,
  settings: PropTypes.object.isRequired
};

export default WidgetTreeCover;
