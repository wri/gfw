import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

import Loader from 'components/loader';
import TooltipChart from 'pages/country/widgets/widget-tooltip';
import WidgetHeader from 'pages/country/widgets/widget-header';
import WidgetPaginate from 'pages/country/widgets/widget-paginate';
import WidgetAreasMostCoverGainSettings from './widget-areas-most-cover-gain-settings-component';
import './widget-areas-most-cover-gain-styles.scss';

class WidgetAreasMostCoverGain extends PureComponent {
  componentWillUpdate(nextProps) {
    const { isLoading, settings, setInitialData, updateData } = this.props;

    if (!nextProps.isLoading && isLoading) {
      setInitialData(nextProps);
    }

    if (JSON.stringify(settings) !== JSON.stringify(nextProps.settings)) {
      updateData(nextProps);
    }
  }

  render() {
    const {
      locationNames,
      isLoading,
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
          title={`AREAS WITH MOST TREE COVER GAIN IN ${locationNames.country &&
            locationNames.country.label}`}
          shareAnchor={'areas-most-cover-gain'}
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
          <Loader />
        ) : (
          <div>
            <p className="title-legend">Hansen - UMD</p>
            <div className="c-widget-areas-most-cover-gain__container">
              <ul className="c-widget-areas-most-cover-gain__legend">
                {areaData.slice(paginateFrom, paginateTo).map((item, index) => (
                  <li key={item.name}>
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
                    {areaChartData.map(item => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    percentage={settings.unit !== 'ha'}
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
  locationNames: PropTypes.object.isRequired,
  areaData: PropTypes.array.isRequired,
  areaChartData: PropTypes.array.isRequired,
  paginate: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  units: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  setInitialData: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  setAreasMostCoverGainSettingsLocation: PropTypes.func.isRequired,
  setAreasMostCoverGainSettingsUnit: PropTypes.func.isRequired
};

export default WidgetAreasMostCoverGain;
