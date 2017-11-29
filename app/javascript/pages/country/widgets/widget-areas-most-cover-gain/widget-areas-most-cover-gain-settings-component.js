import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

class WidgetAreasMostCoverGainSettings extends PureComponent {
  locationChange = value => {
    this.props.onLocationChange(value);
  };

  unitChange = value => {
    this.props.onUnitChange(value.value);
  };

  iconRenderer = () => (
    <svg className="icon icon-angle-arrow-down">
      <use xlinkHref="#icon-angle-arrow-down">{}</use>
    </svg>
  );

  render() {
    const { locations, units, settings } = this.props;
    return (
      <div className="c-widget-settings">
        <div className="c-widget-settings__select">
          <div className="c-widget-settings__title">LOCATION</div>
          <Select
            iconRenderer={this.iconRenderer}
            value={settings.location}
            options={locations}
            onChange={this.locationChange}
          />
        </div>
        <div className="c-widget-settings__select">
          <div className="c-widget-settings__title">UNIT</div>
          <Select
            iconRenderer={this.iconRenderer}
            value={settings.unit}
            options={units}
            onChange={this.unitChange}
          />
        </div>
      </div>
    );
  }
}

WidgetAreasMostCoverGainSettings.propTypes = {
  locations: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired
};

export default WidgetAreasMostCoverGainSettings;
