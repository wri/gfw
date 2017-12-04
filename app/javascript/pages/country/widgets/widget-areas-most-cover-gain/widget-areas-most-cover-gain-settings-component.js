import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetAreasMostCoverGainSettings extends PureComponent {
  render() {
    const {
      locations,
      units,
      settings,
      onLocationChange,
      onUnitChange
    } = this.props;
    return (
      <div className="c-widget-settings">
        <div className="body">
          <Dropdown
            theme="theme-select-light"
            label="LOCATION"
            className="theme-select-light"
            value={settings.location}
            options={locations}
            onChange={onLocationChange}
          />
          <Dropdown
            theme="theme-select-light"
            label="UNIT"
            value={settings.unit}
            options={units}
            onChange={onUnitChange}
          />
        </div>
      </div>
    );
  }
}

WidgetAreasMostCoverGainSettings.propTypes = {
  locations: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func,
  onUnitChange: PropTypes.func
};

export default WidgetAreasMostCoverGainSettings;
