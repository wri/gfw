import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import numeral from 'numeral';

import WidgetHeader from '../widget-header/widget-header';

class WidgetTreeLoss extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading,
      minYear,
      maxYear,
      total,
      years
    } = this.props;

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-tree-loss">
          <WidgetHeader title={`Tree cover loss`} />
          <div className="c-widget-tree-loss__legend">
            <div>
              <div className="c-widget-tree-loss__legend-title">Total Tree Cover Loss</div>
              <div className="c-widget-tree-loss__legend-years">({`${minYear} - ${maxYear}`})</div>
            </div>
            <div>
              <div className="c-widget-tree-loss__legend-title">
                <span style={{backgroundColor: '#f26798'}}></span>
                Country-wide
              </div>
              <div className="c-widget-tree-loss__legend-value" style={{color: '#f26798'}}>
                {numeral(Math.round(total / 1000)).format('0,0')}Ha
              </div>
            </div>
          </div>
          <div className="c-widget-tree-loss__chart">
            <BarChart
              width={627}
              height={300}
              data={years}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <XAxis
                dataKey="date"
                padding={{ top: 135}}
                axisLine={false}
                tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickCount={7}
                tickFormatter={(d) => numeral(Math.round(d / 1000)).format('0,0')} />
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 4" />
              <Tooltip/>
              <Bar
                dataKey="value"
                barSize={22}
                fill="#fe6598" />
            </BarChart>
          </div>
        </div>
      )
    }
  }
}

WidgetTreeLoss.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  years: PropTypes.array.isRequired
};

export default WidgetTreeLoss;
