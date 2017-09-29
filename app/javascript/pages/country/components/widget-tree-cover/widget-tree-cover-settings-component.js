import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

class WidgetTreeCoverSettings extends PureComponent {

  regionChange = (value) => {
    this.props.onRegionChange(value.value);
  };

  unitChange = (value) => {
    this.props.onUnitChange(value.value);
  };

  canopyChange = (value) => {
    this.props.onCanopyChange(value.value);
  };

  render() {
    const {
      regions,
      units,
      canopies,
      settings
    } = this.props;

    return (
      <div className="c-widget-settings">
        <div className="c-widget-settings__select">
          <div className="c-widget-settings__title">LOCATION</div>
          <Select
            value={settings.region}
            options={regions}
            onChange={this.regionChange}/>
        </div>
        <div className="c-widget-settings__select">
          <div className="c-widget-settings__title">UNIT</div>
          <Select
            value={settings.unit}
            options={units}
            onChange={this.unitChange}/>
        </div>
        <div className="c-widget-settings__button-select">
          <div className="c-widget-settings__title">CANOPY DENSITY</div>
          <Select
            value={settings.canopy}
            options={canopies}
            onChange={this.canopyChange}/>
        </div>
      </div>
    );
  }
}

WidgetTreeCoverSettings.propTypes = {
  regions: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  canopies: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  onCanopyChange: PropTypes.func.isRequired
};

export default WidgetTreeCoverSettings;
