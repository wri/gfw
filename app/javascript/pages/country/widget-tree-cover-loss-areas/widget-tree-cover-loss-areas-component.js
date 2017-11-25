import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import numeral from 'numeral';

import Loader from 'components/loader/loader';
import TooltipChart from 'pages/country/tooltip-chart';
import WidgetHeader from 'pages/country/widget-header';
import WidgetPaginate from 'pages/country/widget-paginate';
import WidgetTreeCoverLossAreasSettings from './widget-tree-cover-loss-areas-settings-component';

class WidgetTreeLossAreas extends PureComponent {
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
      regionData,
      paginate,
      nextPage,
      previousPage,
      regionChartData,
      units,
      settings,
      canopies,
      regions,
      years,
      setTreeCoverLossAreasSettingsUnit,
      setTreeCoverLossAreasSettingsCanopy,
      setTreeCoverLossAreasSettingsStartYear,
      setTreeCoverLossAreasSettingsEndYear
    } = this.props;

    const paginateFrom = paginate.page * paginate.limit - paginate.limit;
    const paginateTo = paginateFrom + paginate.limit;

    return (
      <div className="c-widget c-widget-tree-cover-loss-areas">
        <WidgetHeader
          title={`AREAS WITH MOST TREE COVER LOSS IN ${countryData.name}`}
          shareAnchor={'tree-cover-loss-areas'}
        >
          <WidgetTreeCoverLossAreasSettings
            type="settings"
            regions={regions}
            units={units}
            canopies={canopies}
            settings={settings}
            years={years}
            onUnitChange={setTreeCoverLossAreasSettingsUnit}
            onCanopyChange={setTreeCoverLossAreasSettingsCanopy}
            onStartYearChange={setTreeCoverLossAreasSettingsStartYear}
            onEndYearChange={setTreeCoverLossAreasSettingsEndYear}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader isAbsolute />
        ) : (
          <div className="c-widget-tree-cover-loss-areas__container">
            <div className="c-widget-tree-cover-loss-areas__chart">
              <div className="c-widget-tree-cover-loss-areas__legend-title">
                Total Tree Cover Loss
              </div>
              <div className="c-widget-tree-cover-loss-areas__legend-years">
                ({`${settings.startYear} - ${settings.endYear}`})
              </div>
              <PieChart width={222} height={222}>
                <Pie
                  dataKey="value"
                  data={regionChartData}
                  cx={108}
                  cy={108}
                  innerRadius={52}
                  outerRadius={108}
                >
                  {regionChartData.map((item, index) => (
                    <Cell key={index} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  percentage={settings.unit !== 'ha'}
                  showCountry
                  content={<TooltipChart />}
                />
              </PieChart>
            </div>
            <ul className="c-widget-tree-cover-loss-areas__legend">
              <div className="container-list">
                {regionData
                  .slice(paginateFrom, paginateTo)
                  .map((item, index) => (
                    <li key={index}>
                      <div className="c-widget-tree-cover-loss-areas__legend-title">
                        <div style={{ backgroundColor: item.color }}>
                          {item.position}
                        </div>
                        {item.name}
                      </div>
                      <div className="c-widget-tree-cover-loss-areas__legend-value">
                        {settings.unit === 'ha'
                          ? numeral(Math.round(item.value / 1000)).format(
                            '0,0'
                          )
                          : Math.round(item.value)}
                        {settings.unit === 'ha' ? 'ha' : '%'}
                      </div>
                    </li>
                  ))}
              </div>
              <WidgetPaginate
                paginate={paginate}
                count={regionData.length}
                onClickNextPage={nextPage}
                onClickPreviousPage={previousPage}
              />
            </ul>
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeLossAreas.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  regionData: PropTypes.array.isRequired,
  regionChartData: PropTypes.array.isRequired
};

export default WidgetTreeLossAreas;
