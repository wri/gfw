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
    } = this.props;

    const pieCharDataDistricts = [
      { name: 'Minas Gerais', value: 1200, color: '#510626' },
      { name: 'Bahia', value: 1100, color: '#730735' },
      { name: 'Amazonas', value: 900, color: '#af0f54' },
      { name: 'Maranhao', value: 550, color: '#f5247e' },
      { name: 'Distrito Federal', value: 464, color: '#f3599b' },
      { name: 'Ceará', value: 460, color: '#fb9bc4' },
      { name: 'Espírito Santo', value: 440, color: '#f1c5d8' },
      { name: 'Goiás', value: 420, color: '#e9e7a6' },
      { name: 'Maranhão', value: 300, color: '#dad781' },
      { name: 'Mato Grosso', value: 203, color: '#cecb65' },
      { name: 'Other Districts', value: 3000, color: '#e9e9ea' }
    ];

    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-tree-cover-loss-areas">
          <WidgetHeader title={`AREAS WITH MOST TREE COVER LOSS IN ${countryData.name}`} />
          <div className="c-widget-tree-cover-loss-areas__container">
            <div className="c-widget-tree-cover-loss-areas__chart">
              <h3 className="title">Total Tree cover loss</h3>
              <p className="date">(2011 - 2016)</p>
              <PieChart width={216} height={216}>
                <Pie dataKey="value" data={pieCharDataDistricts} cx={108} cy={108} innerRadius={40} outerRadius={100}>
                  {
                    pieCharDataDistricts.map((item, index) => <Cell key={index} fill={item.color}/>)
                  }
                </Pie>
                <Tooltip content={<TooltipChart/>} />
              </PieChart>
            </div>
            <ul className="c-widget-tree-cover-loss-areas__legend">
              {pieCharDataDistricts.map((item, index) => {
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
                <div className="circle-icon"></div>
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
};

export default WidgetTreeLossAreas;
