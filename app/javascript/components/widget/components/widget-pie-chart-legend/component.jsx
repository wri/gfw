import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import PieChart from 'components/charts/pie-chart';
import PieChartLegend from 'components/charts/components/pie-chart-legend';
import Button from 'components/ui/button';

import './styles';

class WidgetPieChart extends PureComponent {
  render() {
    const { data, settings, simple, toggleSettingsMenu } = this.props;
    const noIntersectionSelected =
      !settings.forestType && !settings.landCategory;

    return (
      <div className="c-pie-chart-legend-widget">
        {settings &&
          settings.showSettingsBtn &&
          noIntersectionSelected &&
          toggleSettingsMenu && (
          <Button
            theme="theme-button-small theme-button-light"
            className="pie-contextual-settings-btn"
            onClick={() => toggleSettingsMenu()}
          >
              Select an intersection
          </Button>
        )}
        <div className="pie-and-legend">
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
      </div>
    );
  }
}

WidgetPieChart.propTypes = {
  data: PropTypes.array,
  simple: PropTypes.bool,
  settings: PropTypes.object.isRequired,
  toggleSettingsMenu: PropTypes.func
};

export default WidgetPieChart;
