import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer }from 'recharts';
import numeral from 'numeral';

import TooltipChart from '../tooltip-chart/tooltip-chart';
import WidgetHeader from '../widget-header/widget-header';

class WidgetPlantationArea extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading,
      countryData,
      plantationAreaData,
      startYear,
      endYear
    } = this.props;
    if (isLoading) {
      return <div>loading!</div>
    } else {
      return (
        <div className="c-widget c-widget-plantation-area">
          <WidgetHeader noMap title={`PLANTAtION AREA WITHIN ${countryData.name}`} />
          <div className="c-widget-plantation-area__container">
            <div className="c-widget-plantation-area__chart">
              {plantationAreaData.map((item, index) => {
                return(<div key={index}>
                  <div className="c-widget-plantation-area__legend">
                    <div className="circle">{index + 1}</div>
                    <div className="title">{item.name}</div>
                  </div>
                  <div className="container-percentage">
                    <ResponsiveContainer height={10} width={'100%'}>
                      <BarChart layout="vertical" data={plantationAreaData} stackOffset="expand" barSize={30}>
                       <XAxis hide type="number"/>
                       <YAxis type="category" dataKey="name" stroke="#FFFFFF" fontSize="0" />
                       <Bar dataKey={`one_${index}`} fill="#fba79f" stackId="a" />
                       <Bar dataKey={`two_${index}`} fill="#d29eea" stackId="a" />
                       <Bar dataKey={`three_${index}`} fill="#99cf95" stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="text-percentage">Nan%</div>
                  </div>
                </div>)
              })}
            </div>
          </div>
        </div>
      )
    }
  }
}

WidgetPlantationArea.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  plantationAreaData: PropTypes.array.isRequired
};

export default WidgetPlantationArea;
