import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetPaginate from 'pages/country/widget/components/widget-paginate';
import WidgetSettings from 'pages/country/widget/components/widget-settings';
import './widget-tree-located-styles.scss';

class WidgetTreeLocated extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      data,
      allData,
      dataSources,
      units,
      thresholds,
      settings,
      handlePageChange,
      setTreeLocatedSettingsDataSource,
      setTreeLocatedSettingsUnit,
      setTreeLocatedSettingsThreshold
    } = this.props;
    return (
      <div className="c-widget c-widget-tree-located">
        <WidgetHeader
          title={`Where are the forest located in ${locationNames.current &&
            locationNames.current.label}`}
          shareAnchor={'tree-located'}
        >
          <WidgetSettings
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
              {data &&
                data.length > 0 &&
                data.map((item, index) => (
                  <li key={item.id}>
                    <div className="region-bubble">
                      {index + 1 + settings.pageSize * settings.page}
                    </div>
                    <div className="region-name">{item.label}</div>
                    <div className="region-value">
                      {settings.unit === 'ha'
                        ? `${format('.3s')(item.area)} ha`
                        : `${item.percentage} %`}
                    </div>
                  </li>
                ))}
            </ul>
            <WidgetPaginate
              settings={settings}
              count={(allData && allData.length) || 0}
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
  data: PropTypes.array.isRequired,
  allData: PropTypes.array.isRequired,
  dataSources: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  units: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  setTreeLocatedSettingsDataSource: PropTypes.func.isRequired,
  setTreeLocatedSettingsUnit: PropTypes.func.isRequired,
  setTreeLocatedSettingsThreshold: PropTypes.func.isRequired
};

export default WidgetTreeLocated;
