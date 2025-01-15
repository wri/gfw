import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatNumber } from 'utils/format';

import cx from 'classnames';

import PieChart from 'components/charts/pie-chart';
import PieChartLegend from 'components/charts/components/pie-chart-legend';
import Button from 'components/ui/button';

class WidgetPieChart extends PureComponent {
  render() {
    const {
      data,
      legendData,
      settings,
      chartSettings,
      simple,
      toggleSettingsMenu,
      settingsBtnConfig,
      widget,
      location,
    } = this.props;
    const { pathname } = location;
    const { chartHeight } = settings;
    const { groupedLegends } = chartSettings || {};

    const onMap = pathname.indexOf('map') !== -1;

    const showSettingsBtn =
      settingsBtnConfig &&
      settingsBtnConfig.shouldShowButton &&
      settingsBtnConfig.shouldShowButton(this.props);

    const maxSize =
      (pathname.indexOf('dashboard') >= 0 || pathname.indexOf('embed')) &&
      chartHeight
        ? chartHeight
        : 140;

    return (
      <div className="c-pie-chart-legend-widget">
        {settings && showSettingsBtn && toggleSettingsMenu && (
          <Button
            theme={
              settingsBtnConfig?.theme ||
              'theme-button-small theme-button-light'
            }
            className="pie-contextual-settings-btn"
            onClick={() => toggleSettingsMenu()}
          >
            {settingsBtnConfig.text}
          </Button>
        )}
        <div
          className={cx({
            'pie-and-legend': true,
            'pie-and-legend-grouped': groupedLegends && onMap,
          })}
        >
          <PieChartLegend
            className="cover-legend"
            data={legendData || data}
            config={{
              format: '.3s',
              unit: 'ha',
              key: 'value',
              ...settings,
            }}
            onMap={onMap}
            simple={simple}
            chartSettings={chartSettings}
          />
          <PieChart
            className="cover-pie-chart"
            data={data}
            maxSize={maxSize}
            tooltip={
              widget === 'netChange'
                ? [
                    {
                      key: 'value',
                      labelKey: 'label',
                      unitFormat: (value) =>
                        formatNumber({
                          num: value,
                          unit: 'ha',
                          spaceUnit: true,
                        }),
                    },
                  ]
                : [
                    {
                      key: 'percentage',
                      unit: '%',
                      labelKey: 'label',
                      unitFormat: (value) =>
                        formatNumber({ num: value, specialSpecifier: '.1f' }),
                    },
                  ]
            }
            chartSettings={chartSettings}
            simple={simple}
          />
        </div>
      </div>
    );
  }
}

WidgetPieChart.propTypes = {
  data: PropTypes.array,
  legendData: PropTypes.array,
  simple: PropTypes.bool,
  settings: PropTypes.object.isRequired,
  chartSettings: PropTypes.object,
  toggleSettingsMenu: PropTypes.func,
  settingsBtnConfig: PropTypes.object,
  widget: PropTypes.string,
  location: PropTypes.object,
};

export default WidgetPieChart;
