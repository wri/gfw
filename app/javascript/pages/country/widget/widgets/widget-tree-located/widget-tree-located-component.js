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
      data,
      count,
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
          title={`Where are the forest located in ${locationNames.country &&
            locationNames.country.label}`}
          hasMap
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
        {!isLoading ? (
          <Loader className="loader-offset" />
        ) : (
          <div>
            <ul className="regions">
              {data &&
                data.length > 0 &&
                data.map(item => (
                  <li key={Math.random() + item.value}>
                    <div className="region-bubble">{item.position}</div>
                    <div className="region-name">{item.name}</div>
                    <div className="region-value">
                      {settings.unit === 'ha'
                        ? `${numeral(item.value).format('0,0')} ha`
                        : `${item.value} %`}
                    </div>
                  </li>
                ))}
            </ul>
            <WidgetPaginate
              settings={settings}
              count={count}
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
  count: PropTypes.number.isRequired,
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
