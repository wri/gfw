import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetAreasMostCoverGainSettings extends PureComponent {
  locationChange = value => {
    this.props.onLocationChange(value);
  };

  unitChange = value => {
    this.props.onUnitChange(value.value);
  };

  render() {
    const { locations, units, settings } = this.props;
    return (
      <div className="c-widget-settings">
        <Dropdown
          theme="theme-select-light"
          label="LOCATION"
          className="theme-select-light"
          value={settings.location}
          options={locations}
          onChange={this.locationChange}
        />
        <Dropdown
          theme="theme-select-light"
          label="UNIT"
          value={settings.unit}
          options={units}
          onChange={this.unitChange}
        />
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
