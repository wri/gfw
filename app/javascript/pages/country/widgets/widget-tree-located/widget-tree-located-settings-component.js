import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeLocatedSettings extends PureComponent {
  render() {
    const {
      dataSources,
      units,
      canopies,
      settings,
      onDataSourceChange,
      onUnitChange,
      onCanopyChange
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
          />
          <Dropdown
            theme="theme-select-light"
            label="UNIT"
            vvalue={settings.unit}
            options={units}
            onChange={onUnitChange}
          />
        </div>
        <div className="footer">
          <Dropdown
            theme="theme-select-button"
            label="CANOPY DENSITY"
            value={settings.canopy}
            options={canopies}
            onChange={onCanopyChange}
          />
        </div>
      </div>
    );
  }
}

WidgetTreeLocatedSettings.propTypes = {
  dataSources: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  canopies: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onDataSourceChange: PropTypes.func.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  onCanopyChange: PropTypes.func.isRequired
};

export default WidgetTreeLocatedSettings;
