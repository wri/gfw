import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import Loader from '../../../../common/components/loader/loader';
import WidgetHeader from '../widget-header/widget-header';
import WidgetTreeLocatedSettings from './widget-tree-located-settings-component';

class WidgetTreeLocated extends PureComponent {
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
      topRegions,
      startArray,
      endArray,
      units,
      dataSource,
      canopies,
      settings,
      setTreeLocatedSettingsUnit,
      setTreeLocatedSettingsCanopy
    } = this.props;

    const showUpIcon = startArray >= 10;
    const showDownIcon = endArray >= topRegions.length;
    if (isLoading) {
      return <Loader parentClass="c-widget" />;
    } else {
      return (
        <div className="c-widget c-widget-tree-located">
          <WidgetHeader
            title={`Where are the forest located in ${countryData.name}`}
            noMap={true}>
            <WidgetTreeLocatedSettings
                type="settings"
                dataSource={dataSource}
                units={units}
                canopies={canopies}
                settings={settings}
                onUnitChange={setTreeLocatedSettingsUnit}
                onCanopyChange={setTreeLocatedSettingsCanopy}/>
          </WidgetHeader>
          <ul className="c-widget-tree-located__regions">
            {topRegions.slice(startArray, endArray).map((item, index) => {
              return (
                <li key={index}>
                  <div className="c-widget-tree-located__region-bubble">{item.position}</div>
                  <div className="c-widget-tree-located__region-name">{item.name}</div>
                  <div className="c-widget-tree-located__region-value">
                    {settings.unit === 'Ha' ? numeral(Math.round(item.value / 1000)).format('0,0')+' Ha' : Math.round(item.value)+' %'}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="c-widget-tree-located__scroll-more">
            {showUpIcon && <div className={`circle-icon -up ${showDownIcon ? '-no-right' : ''}`} onClick={this.lessRegion}><svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg></div>}
            {!showDownIcon && <div className="circle-icon" onClick={this.moreRegion}><svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg></div>}
          </div>
        </div>
      );
    }
  }
}

WidgetTreeLocated.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  countryData: PropTypes.object.isRequired,
  topRegions: PropTypes.array.isRequired
};

export default WidgetTreeLocated;
