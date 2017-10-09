import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell } from 'recharts';
import numeral from 'numeral';

import WidgetHeader from '../widget-header/widget-header';
import WidgetUpdating from '../widget-updating/widget-updating';
import WidgetTreeCoverSettings from './widget-tree-cover-settings-component';

class WidgetTreeCover extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

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
      isUpdating,
      viewOnMap,
      countryData,
      totalCover,
      totalIntactForest,
      totalNonForest,
      regions,
      units,
      canopies,
      settings,
      setTreeCoverSettingsRegion,
      setTreeCoverSettingsUnit,
      setTreeCoverSettingsCanopy
    } = this.props;

    if (isLoading) {
      return <div className="c-loading -widget"><div className="loader">Loading...</div></div>
    } else {
      const pieCharData = [
        { name: 'Forest', value: totalCover, color: '#959a00' },
        { name: 'Intact Forest', value: totalIntactForest, color: '#2d8700' },
        { name: 'Non Forest', value: totalNonForest, color: '#d1d1d1' }
      ];
      const unitMeasure = settings.unit === 'Ha' ? 'Ha' : '%';
      return (
        <div className="c-widget c-widget-tree-cover">
          <WidgetHeader
            title={`Forest cover in ${countryData.name}`}
            viewOnMapCallback={viewOnMap}>
            <WidgetTreeCoverSettings
              type="settings"
              regions={regions}
              units={units}
              canopies={canopies}
              settings={settings}
              onRegionChange={setTreeCoverSettingsRegion}
              onUnitChange={setTreeCoverSettingsUnit}
              onCanopyChange={setTreeCoverSettingsCanopy}/>
          </WidgetHeader>
          <ul className="c-widget-tree-cover__legend">
            {pieCharData.map((item, index) => {
              return (
                <li key={index}>
                  <div className="c-widget-tree-cover__legend-title">
                    <span style={{backgroundColor: item.color}}></span>
                    {item.name}
                  </div>
                  <div className="c-widget-tree-cover__legend-value" style={{color: item.color}}>
                    {settings.unit === 'Ha' ? numeral(Math.round(item.value / 1000)).format('0,0') : Math.round(item.value) }{unitMeasure}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="c-widget-tree-cover__chart">
            <PieChart width={121} height={121}>
              <Pie dataKey="value" data={pieCharData} cx={56} cy={56} innerRadius={28} outerRadius={60}>
                {
                  pieCharData.map((item, index) => <Cell key={index} fill={item.color}/>)
                }
              </Pie>
            </PieChart>
          </div>
          {isUpdating ? <WidgetUpdating /> : null}
        </div>
      )
    }
  }
}

WidgetTreeCover.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  viewOnMap: PropTypes.func.isRequired,
  countryData: PropTypes.object.isRequired,
  totalCover: PropTypes.number.isRequired,
  totalIntactForest: PropTypes.number.isRequired,
  totalNonForest: PropTypes.number.isRequired,
  regions: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  canopies: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  setTreeCoverSettingsRegion: PropTypes.func.isRequired,
  setTreeCoverSettingsUnit: PropTypes.func.isRequired,
  setTreeCoverSettingsCanopy: PropTypes.func.isRequired
};

export default WidgetTreeCover;
