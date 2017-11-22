import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

import Loader from 'components/loader';
import TooltipChart from 'pages/country/tooltip-chart';
import WidgetHeader from 'pages/country/widget-header';
import WidgetPaginate from 'pages/country/widget-paginate';
import WidgetAreasMostCoverGainSettings from './widget-areas-most-cover-gain-settings-component';

class WidgetAreasMostCoverGain extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  componentWillUpdate(nextProps) {
    const { settings, updateData } = this.props;

    if (JSON.stringify(settings) !== JSON.stringify(nextProps.settings)) {
      updateData(nextProps);
    }
  }

  render() {
    const {
      isLoading,
      countryData,
      areaData,
      areaChartData,
      paginate,
      settings,
      units,
      locations,
      nextPage,
      previousPage,
      setAreasMostCoverGainSettingsLocation,
      setAreasMostCoverGainSettingsUnit
    } = this.props;

    const paginateFrom = paginate.page * paginate.limit - paginate.limit;
    const paginateTo = paginateFrom + paginate.limit;

    return (
      <div className="c-widget c-widget-areas-most-cover-gain">
        <WidgetHeader
          title={`AREAS WITH MOST TREE COVER GAIN IN ${countryData.name}`}
        >
          <WidgetAreasMostCoverGainSettings
            type="settings"
            locations={locations}
            units={units}
            settings={settings}
            onLocationChange={setAreasMostCoverGainSettingsLocation}
            onUnitChange={setAreasMostCoverGainSettingsUnit}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader isAbsolute />
        ) : (
          <div>
            <p className="title-legend">Hansen - UMD</p>
            <div className="c-widget-areas-most-cover-gain__container">
              <ul className="c-widget-areas-most-cover-gain__legend">
                {areaData.slice(paginateFrom, paginateTo).map((item, index) => (
                  <li key={index}>
                    <div className="c-widget-areas-most-cover-gain__legend-title">
                      <div style={{ backgroundColor: item.color }}>
                        {index + 1}
                      </div>
                      {item.name}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="c-widget-areas-most-cover-gain__chart">
                <PieChart width={150} height={150}>
                  <Pie
                    dataKey="value"
                    data={areaChartData}
                    cx={70}
                    cy={70}
                    innerRadius={35}
                    outerRadius={70}
                  >
                    {areaChartData.map((item, index) => (
                      <Cell key={index} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    percentage={settings.unit !== 'Ha'}
                    percentageAndArea={false}
                    showCountry
                    content={<TooltipChart />}
                  />
                </PieChart>
              </div>
            </div>
            <WidgetPaginate
              paginate={paginate}
              count={areaData.length}
              onClickNextPage={nextPage}
              onClickPreviousPage={previousPage}
            />
          </div>
        )}
      </div>
    );
  }
}

WidgetAreasMostCoverGain.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  areaData: PropTypes.array.isRequired
};

export default WidgetAreasMostCoverGain;
