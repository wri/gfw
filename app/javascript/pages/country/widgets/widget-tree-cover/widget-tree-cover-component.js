import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import numeral from 'numeral';

import Loader from 'components/loader/loader';
import WidgetTooltip from 'pages/country/widgets/widget-tooltip';
import WidgetHeader from 'pages/country/widgets/widget-header';
import WidgetTreeCoverSettings from './widget-tree-cover-settings-component';

import './widget-tree-cover-styles.scss';

class WidgetTreeCover extends PureComponent {
  render() {
    const {
      isLoading,
      data,
      indicators,
      units,
      thresholds,
      settings,
      setTreeCoverSettingsIndicator,
      setTreeCoverSettingsUnit,
      setTreeCoverSettingsThreshold,
      getTitle
    } = this.props;

    return (
      <div className="c-widget c-widget-tree-cover">
        <WidgetHeader title={getTitle()} shareAnchor={'tree-cover'}>
          <WidgetTreeCoverSettings
            type="settings"
            indicators={indicators}
            units={units}
            thresholds={thresholds}
            settings={settings}
            onIndicatorChange={option =>
              setTreeCoverSettingsIndicator(option.value)
            }
            onUnitChange={option => setTreeCoverSettingsUnit(option.value)}
            onThresholdChange={option =>
              setTreeCoverSettingsThreshold(option.value)
            }
            isLoading={isLoading}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <ul className="legend">
              {data.map((item, index) => (
                <li key={index.toString()}>
                  <div className="legend-title">
                    <span style={{ backgroundColor: item.color }}>{}</span>
                    {item.name}
                  </div>
                  <div className="legend-value" style={{ color: item.color }}>
                    {settings.unit === 'ha'
                      ? numeral(item.value).format('0,0 a')
                      : numeral(item.percentage).format('0.00')}
                    <span className="unit-text"> {settings.unit}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="chart">
              <PieChart width={121} height={121}>
                <Pie
                  dataKey="value"
                  data={data}
                  cx={56}
                  cy={56}
                  innerRadius={28}
                  outerRadius={60}
                >
                  {data.map((item, index) => (
                    <Cell key={index.toString()} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip percentageAndArea content={<WidgetTooltip />} />
              </PieChart>
            </div>
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  getTitle: PropTypes.func.isRequired,
  indicators: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  setTreeCoverSettingsIndicator: PropTypes.func.isRequired,
  setTreeCoverSettingsUnit: PropTypes.func.isRequired,
  setTreeCoverSettingsThreshold: PropTypes.func.isRequired
};

export default WidgetTreeCover;
