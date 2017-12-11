import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeLocatedSettings extends PureComponent {
  render() {
    const {
      isLoading,
      dataSources,
      units,
      thresholds,
      settings,
      onDataSourceChange,
      onUnitChange,
      onThresholdChange
    } = this.props;
    return (
      <div className="c-widget-settings">
        <div className="body">
          <Dropdown
            theme="theme-select-light"
            label="DATA SOURCE"
            value={settings.dataSource}
            options={dataSources}
            onChange={onDataSourceChange}
            disabled={isLoading}
          />
          <Dropdown
            theme="theme-select-light"
            label="UNIT"
            value={settings.unit}
            options={units}
            onChange={onUnitChange}
          />
        </div>
        <div className="footer">
          <Dropdown
            theme="theme-select-button"
            label="CANOPY DENSITY"
            value={settings.threshold}
            options={thresholds}
            onChange={onThresholdChange}
            disabled={isLoading}
          />
        </div>
      </div>
    );
  }
}

WidgetTreeLocatedSettings.propTypes = {
  dataSources: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onDataSourceChange: PropTypes.func.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  onThresholdChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default WidgetTreeLocatedSettings;
