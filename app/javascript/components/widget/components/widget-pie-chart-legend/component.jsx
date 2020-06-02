import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import PieChart from 'components/charts/pie-chart';
import PieChartLegend from 'components/charts/components/pie-chart-legend';
import Button from 'components/ui/button';

import './styles.scss';

class WidgetPieChart extends PureComponent {
  render() {
    const {
      data,
      settings,
      simple,
      toggleSettingsMenu,
      settingsBtnConfig
    } = this.props;
    const showSettingsBtn =
      settingsBtnConfig &&
      settingsBtnConfig.shouldShowButton &&
      settingsBtnConfig.shouldShowButton(this.props);

    return (
      <div className="c-pie-chart-legend-widget">
        {settings &&
          showSettingsBtn &&
          toggleSettingsMenu && (
          <Button
            theme="theme-button-small theme-button-light"
            className="pie-contextual-settings-btn"
            onClick={() => toggleSettingsMenu()}
          >
            {settingsBtnConfig.text}
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
  toggleSettingsMenu: PropTypes.func,
  settingsBtnConfig: PropTypes.object
};

export default WidgetPieChart;
