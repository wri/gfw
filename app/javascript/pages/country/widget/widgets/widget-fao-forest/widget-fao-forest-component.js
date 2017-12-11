import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import numeral from 'numeral';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetTooltip from 'pages/country/widget/components/widget-tooltip';
import WidgetFAOForestTooltip from './widget-fao-forest-tooltip-component';
import './widget-fao-forest-styles.scss';

class WidgetFAOForestGain extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      getWidgetValues,
      getSentence,
      getChartData
    } = this.props;
    const values = getWidgetValues(this.props);
    const chartData = getChartData(values);

    return (
      <div className="c-widget c-widget-fao-forest">
        <WidgetHeader
          title={`Forest cover in ${locationNames.current &&
            locationNames.current.label}`}
          shareAnchor={'fao-forest'}
        />
        {isLoading ? (
          <Loader className="loader-offset" />
        ) : (
          <div>
            <div
              className="sentence"
              dangerouslySetInnerHTML={getSentence(values, this.props)} // eslint-disable-line
            />
            <ul className="legend">
              {chartData.map((item, index) => (
                <li key={index.toString()}>
                  <div className="legend-title">
                    <span style={{ backgroundColor: item.color }}>{}</span>
                    {item.name}
                  </div>
                  <div className="legend-value" style={{ color: item.color }}>
                    {numeral(item.value / 10000000).format('0.0')}
                    <span className="unit-text"> %</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="chart">
              <PieChart width={121} height={121}>
                <Pie
                  dataKey="value"
                  data={chartData}
                  cx={56}
                  cy={56}
                  innerRadius={28}
                  outerRadius={60}
                >
                  {chartData.map((item, index) => (
                    <Cell key={index.toString()} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <WidgetTooltip>
                      <WidgetFAOForestTooltip />
                    </WidgetTooltip>
                  }
                />
              </PieChart>
            </div>
          </div>
        )}
      </div>
    );
  }
}

WidgetFAOForestGain.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getWidgetValues: PropTypes.func.isRequired,
  getSentence: PropTypes.func.isRequired,
  getChartData: PropTypes.func.isRequired
};

export default WidgetFAOForestGain;
