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

import WidgetHeader from '../widget-header/widget-header';

class WidgetTreeLoss extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading,
      years
    } = this.props;

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-tree-loss">
          <WidgetHeader title={`Forest loss`} />
          <div className="c-widget-tree-loss__chart">
            <BarChart
              width={600}
              height={300}
              data={years}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <XAxis dataKey="date"/>
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Bar dataKey="value" fill="#fe6598" />
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
