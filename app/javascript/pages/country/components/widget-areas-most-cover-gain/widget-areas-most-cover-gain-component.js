import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, Cell }from 'recharts';
import numeral from 'numeral';

import TooltipChart from '../tooltip-chart/tooltip-chart';
import WidgetHeader from '../widget-header/widget-header';

class WidgetAreasMostCoverGain extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading,
      countryData,
      areaData,
      startYear,
      endYear
    } = this.props;

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-areas-most-cover-gain">
          <WidgetHeader title={`AREAS WITH MOST TREE COVER GAIN IN ${countryData.name}`} />
          <p className="title-legend">Hansen - UMD</p>
          <div className="c-widget-areas-most-cover-gain__container">
            <ul className="c-widget-areas-most-cover-gain__legend">
              {areaData.map((item, index) => {
                return (
                  <li key={index}>
                    <div className="c-widget-areas-most-cover-gain__legend-title">
                      <div style={{backgroundColor: item.color}}>{index + 1}</div>
                      {item.name}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="c-widget-areas-most-cover-gain__chart">
              <PieChart width={150} height={150}>
                <Pie dataKey="value" data={areaData} cx={70} cy={70} innerRadius={35} outerRadius={70}>
                  {
                    areaData.map((item, index) => <Cell key={index} fill={item.color}/>)
                  }
                </Pie>
                <Tooltip content={<TooltipChart/>} />
              </PieChart>
            </div>
          </div>
          <div className="c-widget-areas-most-cover-gain__scroll-more">
            <div className="circle-icon"><svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg></div>
          </div>
        </div>
      )
    }
  }
}

WidgetAreasMostCoverGain.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  areaData: PropTypes.array.isRequired
};

export default WidgetAreasMostCoverGain;
