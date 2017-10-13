import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, Cell }from 'recharts';
import numeral from 'numeral';

import WidgetUpdating from '../widget-updating/widget-updating';
import TooltipChart from '../tooltip-chart/tooltip-chart';
import WidgetHeader from '../widget-header/widget-header';
import WidgetAreasMostCoverGainSettings from './widget-areas-most-cover-gain-settings-component';

class WidgetAreasMostCoverGain extends PureComponent {
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
      settings,
      updateData
    } = this.props;

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
      startYear,
      endYear,
      startArray,
      endArray,
      settings,
      units,
      regions,
      setTreeLocatedSettingsUnit,
      isUpdating
    } = this.props;

    const showUpIcon = startArray >= 10;
    const showDownIcon = endArray >= areaData.length;

    if (isLoading) {
      return <div className="c-loading -widget"><div className="loader">Loading...</div></div>
    } else {
      return (
        <div className="c-widget c-widget-areas-most-cover-gain">
          <WidgetHeader title={`AREAS WITH MOST TREE COVER GAIN IN ${countryData.name}`} >
          <WidgetAreasMostCoverGainSettings
            type="settings"
            regions={regions}
            units={units}
            onUnitChange={setTreeLocatedSettingsUnit}
            settings={settings} />
        </WidgetHeader>
          <p className="title-legend">Hansen - UMD</p>
          <div className="c-widget-areas-most-cover-gain__container">
            <ul className="c-widget-areas-most-cover-gain__legend">
              {areaData.slice(startArray, endArray).map((item, index) => {
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
                <Pie dataKey="value" data={areaChartData} cx={70} cy={70} innerRadius={35} outerRadius={70}>
                  {
                    areaChartData.map((item, index) => <Cell key={index} fill={item.color}/>)
                  }
                </Pie>
                <Tooltip percentage={settings.unit !== 'Ha'} percentageAndArea={false} showCountry content={<TooltipChart/>} />
              </PieChart>
            </div>
          </div>
          <div className="c-widget-areas-most-cover-gain__scroll-more">
            {showUpIcon && <div className="circle-icon -up" onClick={this.lessRegion}><svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg></div>}
            {!showDownIcon && <div className="circle-icon" onClick={this.moreRegion}><svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg></div>}
          </div>
          {isUpdating ? <WidgetUpdating /> : null}
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
