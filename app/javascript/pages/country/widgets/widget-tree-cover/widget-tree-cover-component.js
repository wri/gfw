import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import numeral from 'numeral';

import Loader from 'components/loader/loader';
import TooltipChart from 'pages/country/widgets/widget-tooltip';
import WidgetHeader from 'pages/country/widgets/widget-header';
import WidgetTreeCoverSettings from './widget-tree-cover-settings-component';
import './widget-tree-cover-styles.scss';

class WidgetTreeCover extends PureComponent {
  getTitle = () => {
    const { adminsSelected } = this.props;
    return `Forest cover ${adminsSelected.current &&
      adminsSelected.current.label} in ${adminsSelected.country &&
      adminsSelected.country.label}`;
  };

  render() {
    const {
      isLoading,
      totalCover,
      totalIntactForest,
      totalNonForest,
      indicators,
      units,
      thresholds,
      settings,
      setTreeCoverSettingsIndicator,
      setTreeCoverSettingsUnit,
      setTreeCoverSettingsThreshold
    } = this.props;

    const totalValue = totalCover + totalIntactForest + totalNonForest;
    const pieCharData = [
      {
        name: 'Forest',
        value: totalCover,
        color: '#959a00',
        percentage: totalCover / totalValue * 100
      },
      {
        name: 'Intact Forest',
        value: totalIntactForest,
        color: '#2d8700',
        percentage: totalIntactForest / totalValue * 100
      },
      {
        name: 'Non Forest',
        value: totalNonForest,
        color: '#d1d1d1',
        percentage: totalNonForest / totalValue * 100
      }
    ];
    const unitMeasure = settings.unit === 'ha' ? 'ha' : '%';

    return (
      <div className="c-widget c-widget-tree-cover">
        <WidgetHeader title={this.getTitle()} shareAnchor={'tree-cover'}>
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
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <ul className="c-widget-tree-cover__legend">
              {pieCharData.map((item, index) => (
                <li key={index.toString()}>
                  <div className="c-widget-tree-cover__legend-title">
                    <span style={{ backgroundColor: item.color }}>{}</span>
                    {item.name}
                  </div>
                  <div
                    className="c-widget-tree-cover__legend-value"
                    style={{ color: item.color }}
                  >
                    {settings.unit === 'ha'
                      ? numeral(Math.round(item.value / 1000)).format('0,0')
                      : Math.round(item.value)}
                    <span className="unit-text">{unitMeasure}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="c-widget-tree-cover__chart">
              <PieChart width={121} height={121}>
                <Pie
                  dataKey="value"
                  data={pieCharData}
                  cx={56}
                  cy={56}
                  innerRadius={28}
                  outerRadius={60}
                >
                  {pieCharData.map((item, index) => (
                    <Cell key={index.toString()} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip percentageAndArea content={<TooltipChart />} />
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
  totalCover: PropTypes.number.isRequired,
  totalIntactForest: PropTypes.number.isRequired,
  totalNonForest: PropTypes.number.isRequired,
  adminsSelected: PropTypes.object.isRequired,
  indicators: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  setTreeCoverSettingsIndicator: PropTypes.func.isRequired,
  setTreeCoverSettingsUnit: PropTypes.func.isRequired,
  setTreeCoverSettingsThreshold: PropTypes.func.isRequired
};

export default WidgetTreeCover;
