import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetPaginate from 'pages/country/widget/components/widget-paginate';
import WidgetTreeLocatedSettings from './widget-tree-located-settings-component';
import './widget-tree-located-styles.scss';

class WidgetTreeLocated extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      topRegions,
      dataSources,
      units,
      thresholds,
      settings,
      paginate,
      handlePageChange,
      setTreeLocatedSettingsDataSource,
      setTreeLocatedSettingsUnit,
      setTreeLocatedSettingsThreshold
    } = this.props;

    const paginateFrom = paginate.page * paginate.limit - paginate.limit;
    const paginateTo = paginateFrom + paginate.limit;

    return (
      <div className="c-widget c-widget-tree-located">
        <WidgetHeader
          title={`Where are the forest located in ${locationNames.country &&
            locationNames.country.label}`}
          noMap
          shareAnchor={'tree-located'}
        >
          <WidgetTreeLocatedSettings
            type="settings"
            dataSources={dataSources}
            units={units}
            thresholds={thresholds}
            settings={settings}
            onDataSourceChange={setTreeLocatedSettingsDataSource}
            onUnitChange={setTreeLocatedSettingsUnit}
            onThresholdChange={setTreeLocatedSettingsThreshold}
            isLoading={isLoading}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader className="loader-offset" />
        ) : (
          <div>
            <ul className="regions">
              {topRegions.slice(paginateFrom, paginateTo).map(item => (
                <li key={item.value}>
                  <div className="region-bubble">{item.position}</div>
                  <div className="region-name">{item.name}</div>
                  <div className="region-value">
                    {settings.unit === 'ha'
                      ? `${numeral(Math.round(item.value / 1000)).format(
                        '0,0'
                      )} ha`
                      : `${Math.round(item.value)} %`}
                  </div>
                </li>
              ))}
            </ul>
            <WidgetPaginate
              paginate={paginate}
              count={topRegions.length}
              onClickChange={handlePageChange}
            />
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeLocated.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  locationNames: PropTypes.object,
  topRegions: PropTypes.array.isRequired,
  dataSources: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  units: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired,
  paginate: PropTypes.object.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  setTreeLocatedSettingsDataSource: PropTypes.func.isRequired,
  setTreeLocatedSettingsUnit: PropTypes.func.isRequired,
  setTreeLocatedSettingsThreshold: PropTypes.func.isRequired
};

export default WidgetTreeLocated;
