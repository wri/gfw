import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

import Loader from 'components/loader/loader';
import TooltipChart from 'pages/country/tooltip-chart';
import WidgetHeader from 'pages/country/widget-header';
import WidgetTotalAreaPlantationsSettings from './widget-total-area-plantations-settings-component';

class WidgetTotalAreaPlantations extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  componentWillUpdate(nextProps) {
    const { updateData, settings } = this.props;

    if (JSON.stringify(settings) !== JSON.stringify(nextProps.settings)) {
      updateData(nextProps);
    }
  }

  render() {
    const {
      isLoading,
      countryData,
      plantationData,
      settings,
      units,
      setTotalAreaPlantationsSettingsUnit
    } = this.props;

    return (
      <div className="c-widget c-widget-total-area-plantations">
        <WidgetHeader
          title={`TOTAL AREA OF PLANTATIONS WITHIN ${countryData.name}`}
          shareAnchor={'total-area-plantations'}
        >
          <WidgetTotalAreaPlantationsSettings
            type="settings"
            units={units}
            settings={settings}
            onUnitChange={setTotalAreaPlantationsSettingsUnit}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader isAbsolute />
        ) : (
          <div>
            <p className="title-legend">By Type</p>
            <p className="title-legend-years">
              ({settings.startYear} - {settings.endYear})
            </p>
            <div className="c-widget-total-area-plantations__container">
              <ul className="c-widget-total-area-plantations__legend">
                {plantationData.map((item, index) => (
                  <li key={index}>
                    <div
                      className="c-widget-total-area-plantations__bubble"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="c-widget-total-area-plantations__name">
                      {item.name}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="c-widget-total-area-plantations__chart">
                <PieChart width={120} height={120}>
                  <Pie
                    dataKey="value"
                    data={plantationData}
                    cx={55}
                    cy={55}
                    innerRadius={28}
                    outerRadius={60}
                  >
                    {plantationData.map((item, index) => (
                      <Cell key={index} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<TooltipChart />} />
                </PieChart>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

WidgetTotalAreaPlantations.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  plantationData: PropTypes.array.isRequired
};

export default WidgetTotalAreaPlantations;
