import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, Cell }from 'recharts';

import Loader from '../../../../common/components/loader/loader';
import TooltipChart from '../tooltip-chart/tooltip-chart';
import WidgetHeader from '../widget-header/widget-header';
import WidgetTotalAreaPlantationsSettings from './widget-total-area-plantations-settings-component';

class WidgetTotalAreaPlantations extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  render() {
    const {
      isLoading,
      countryData,
      plantationData,
      startYear,
      endYear,
      settings,
      units
    } = this.props;

    if (isLoading) {
      return <Loader parentClass="c-widget" />;
    } else {
      return (
        <div className="c-widget c-widget-total-area-plantations">
          <WidgetHeader title={`TOTAL AREA OF PLANTATIONS WITHIN ${countryData.name}`} >
          <WidgetTotalAreaPlantationsSettings
            type="settings"
            units={units}
            settings={settings} />
        </WidgetHeader>
          <p className="title-legend -dark">By Type</p>
          <p className="title-legend">({startYear} - {endYear})</p>
          <div className="c-widget-total-area-plantations__container">
            <ul className="c-widget-total-area-plantations__legend">
              {plantationData.map((item, index) => {
                return (
                  <li key={index}>
                    <div className="c-widget-total-area-plantations__legend-title">
                      <div style={{backgroundColor: item.color}}>{index + 1}</div>
                      {item.name}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="c-widget-total-area-plantations__chart">
              <PieChart width={150} height={150}>
                <Pie dataKey="value" data={plantationData} cx={70} cy={70} innerRadius={35} outerRadius={70}>
                  {
                    plantationData.map((item, index) => <Cell key={index} fill={item.color}/>)
                  }
                </Pie>
                <Tooltip content={<TooltipChart/>} />
              </PieChart>
            </div>
          </div>
        </div>
      )
    }
  }
}

WidgetTotalAreaPlantations.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  plantationData: PropTypes.array.isRequired
};

export default WidgetTotalAreaPlantations;
