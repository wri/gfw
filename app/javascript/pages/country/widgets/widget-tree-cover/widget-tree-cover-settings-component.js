import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeCoverSettings extends PureComponent {
  locationChange = value => {
    this.props.onLocationChange(value);
  };

  unitChange = value => {
    this.props.onUnitChange(value.value);
  };

  canopyChange = value => {
    this.props.onCanopyChange(value.value);
  };

  render() {
    const { locations, units, canopies, settings } = this.props;

    return (
      <div className="c-widget-settings">
        <Dropdown
          theme="theme-select-light"
          label="LOCATION"
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
        <Dropdown
          theme="theme-select-button"
          label="CANOPY DENSITY"
          value={settings.canopy}
          options={canopies}
          onChange={this.canopyChange}
        />
      </div>
    );
  }
}

WidgetTreeCoverSettings.propTypes = {
  locations: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  canopies: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  onCanopyChange: PropTypes.func.isRequired
};

export default WidgetTreeCoverSettings;
