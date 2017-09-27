import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, Cell }from 'recharts';
import numeral from 'numeral';

import TooltipChart from '../tooltip-chart/tooltip-chart';
import WidgetHeader from '../widget-header/widget-header';

class WidgetTreeLossAreas extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading,
      countryData,
      regionData,
      startYear,
      endYear
    } = this.props;

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-tree-cover-loss-areas">
          <WidgetHeader title={`AREAS WITH MOST TREE COVER LOSS IN ${countryData.name}`} />
          <div className="c-widget-tree-cover-loss-areas__container">
            <div className="c-widget-tree-cover-loss-areas__chart">
              <h3 className="title">Total Tree cover loss</h3>
              <p className="date">({startYear} - {endYear})</p>
              <PieChart width={216} height={216}>
                <Pie dataKey="value" data={regionData} cx={108} cy={108} innerRadius={40} outerRadius={100}>
                  {
                    regionData.map((item, index) => <Cell key={index} fill={item.color}/>)
                  }
                </Pie>
                <Tooltip content={<TooltipChart/>} />
              </PieChart>
            </div>
            <ul className="c-widget-tree-cover-loss-areas__legend">
              {regionData.map((item, index) => {
                return (
                  <li key={index}>
                    <div className="c-widget-tree-cover-loss-areas__legend-title">
                      <div style={{backgroundColor: item.color}}>{index + 1}</div>
                      {item.name}
                    </div>
                    <div className="c-widget-tree-cover-loss-areas__legend-value">
                      {item.value}Ha
                    </div>
                  </li>
                );
              })}
              <div className="c-widget-tree-cover-loss-areas__scroll-more">
                <div className="circle-icon"><svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg></div>
              </div>
            </ul>
          </div>
        </div>
      )
    }
  }
}

WidgetTreeLossAreas.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  regionData: PropTypes.array.isRequired
};

export default WidgetTreeLossAreas;
