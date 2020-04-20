import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PieChartLegend from 'components/charts/components/pie-chart-legend';

import './styles.scss';

class WidgetListLegend extends PureComponent {
  render() {
    const { data, settings, simple } = this.props;

    return (
      <div className="c-list-legend-widget">
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
      </div>
    );
  }
}

WidgetListLegend.propTypes = {
  data: PropTypes.array,
  simple: PropTypes.bool,
  settings: PropTypes.object.isRequired
};

export default WidgetListLegend;
