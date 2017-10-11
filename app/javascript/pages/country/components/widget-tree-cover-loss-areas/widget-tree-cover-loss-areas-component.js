import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, Cell }from 'recharts';
import numeral from 'numeral';

import WidgetUpdating from '../widget-updating/widget-updating';
import TooltipChart from '../tooltip-chart/tooltip-chart';
import WidgetHeader from '../widget-header/widget-header';
import WidgetTreeCoverLossAreasSettings from './widget-tree-cover-loss-areas-settings-component';

class WidgetTreeLossAreas extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  moreRegion = () => {
    const { moreRegion } = this.props;
    moreRegion();
  };

  lessRegion = () => {
    const { lessRegion } = this.props;
    lessRegion();
  };

  componentWillUpdate(nextProps) {
    const {
      updateData,
      settings,
    } = this.props;

    if (JSON.stringify(settings) !== JSON.stringify(nextProps.settings)) {
      updateData(nextProps);
    }
  }

  render() {
    const {
      isLoading,
      countryData,
      regionData,
      startYear,
      endYear,
      startArray,
      endArray,
      regionChartData,
      units,
      settings,
      canopies,
      regions,
      years,
      setTreeCoverLossAreasSettingsUnit,
      setTreeCoverLossAreasSettingsCanopy,
      setTreeCoverLossAreasSettingsStartYear,
      setTreeCoverLossAreasSettingsEndYear,
      isUpdating
    } = this.props;

    const showUpIcon = startArray >= 10;
    const showDownIcon = endArray >= regionData.length;
    if (isLoading) {
      return <div className="c-loading -widget"><div className="loader">Loading...</div></div>
    } else {
      return (
        <div className="c-widget c-widget-tree-cover-loss-areas">
          <WidgetHeader title={`AREAS WITH MOST TREE COVER LOSS IN ${countryData.name}`} >
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
            onEndYearChange={setTreeCoverLossAreasSettingsEndYear}/>
        </WidgetHeader>
          <div className="c-widget-tree-cover-loss-areas__container">
            <div className="c-widget-tree-cover-loss-areas__chart">
              <h3 className="title">Total Tree cover loss</h3>
              <p className="date">({startYear} - {endYear})</p>
              <PieChart width={216} height={216}>
                <Pie dataKey="value" data={regionChartData} cx={108} cy={108} innerRadius={40} outerRadius={100}>
                  {
                    regionChartData.map((item, index) => <Cell key={index} fill={item.color}/>)
                  }
                </Pie>
                <Tooltip percentage={settings.unit !== 'Ha'} showCountry content={<TooltipChart />} />
              </PieChart>
            </div>
            <ul className="c-widget-tree-cover-loss-areas__legend">
              <div className="container-list">
                {regionData.slice(startArray, endArray).map((item, index) => {
                  return (
                    <li key={index}>
                      <div className="c-widget-tree-cover-loss-areas__legend-title">
                        <div style={{backgroundColor: item.color}}>{item.position}</div>
                        {item.name}
                      </div>
                      <div className="c-widget-tree-cover-loss-areas__legend-value">
                        {settings.unit === 'Ha' ? numeral(Math.round(item.value / 1000)).format('0,0') : Math.round(item.value)}{settings.unit === 'Ha' ? 'Ha' : '%'}
                      </div>
                    </li>
                  );
                })}
              </div>
              <div className="c-widget-tree-cover-loss-areas__scroll-more">
                {showUpIcon && <div className="circle-icon -up" onClick={this.lessRegion}><svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg></div>}
                {!showDownIcon && <div className="circle-icon" onClick={this.moreRegion}><svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg></div>}
              </div>
            </ul>
          </div>
          {isUpdating ? <WidgetUpdating /> : null}
        </div>
      )
    }
  }
}

WidgetTreeLossAreas.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  regionData: PropTypes.array.isRequired,
  regionChartData: PropTypes.array.isRequired
};

export default WidgetTreeLossAreas;
